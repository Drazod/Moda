import { Request, Response } from "express";
import { prisma } from ".."; 
import { State } from "@prisma/client";

export const getCart = async (req: Request, res: Response) => {
  if (!req.user) return res.status(401).json({ message: "User not authenticated" });

  try {
    let carts;

    if (req.user.role === "ADMIN") {
      // Admin can see all carts
      carts = await prisma.cart.findMany({
        include: {
          items: {
            include: { Clothes: true },
          },
        },
      });
    } else {
      // Regular users only see their own PENDING cart
      carts = await prisma.cart.findMany({
        where: { userId: req.user.id, state: "PENDING" },
        include: {
          items: {
            include: { Clothes: true },
          },
        },
      });
    }

    res.status(200).json({ carts });
  } catch (error) {
    console.error("Error getting carts:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const getCartById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const cart = await prisma.cart.findUnique({
      where: { id: parseInt(id) },
      include: {
        items: {
          include: {
            Clothes: true,
          },
        },
      },
    });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    res.status(200).json({ cart });
  } catch (error) {
    console.error("Error getting cart:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export const createCart = async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "User not authenticated" });
  }
  try {
    // Check if user already has a PENDING cart
    const existingCart = await prisma.cart.findFirst({
      where: { userId: req.user.id, state: "PENDING" },
    });
    if (existingCart) {
      return res.status(200).json({ cart: existingCart, message: "Cart already exists for user" });
    }
    const cart = await prisma.cart.create({
      data: {
        userId: req.user.id,
      },
    });
    res.status(201).json({ cart });
  } catch (error) {
    console.error("Error creating cart:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export const updateCart = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { userId } = req.body;

  try {
    const cart = await prisma.cart.update({
      where: { id: parseInt(id) },
      data: { userId },
    });

    res.status(200).json({ cart });
  } catch (error) {
    console.error("Error updating cart:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export const placeOrder = async (req: Request, res: Response) => {
  console.log('Authorization header:', req.headers.authorization);
  const { id } = req.params;
  // const { userId } = req.body;
  try {
    // Get all cart items for this cart
    const cartItems = await prisma.cartItem.findMany({
      where: { cartId: parseInt(id) },
    });
    // Only update cart state, do not decrement size quantity here
    const updateCart = await prisma.cart.update({
      where: { id: parseInt(id) },
      data: { state: "ORDERED" }
    });
    res.status(200).json({ updateCart });
  } catch (error) {
    console.error("Error updating cart:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export const deleteCart = async (req: Request, res: Response) => {
  if (!req.user) return res.status(401).json({ message: "User not authenticated" });
  
  const userId = req.user.id;

  try {
    // Find the user's current "PENDING" cart
    const cart = await prisma.cart.findFirst({
      where: { userId, state: "PENDING" },
      include: { items: true },
    });

    if (!cart) return res.status(404).json({ message: "Cart not found" });

    // Delete all cart items
    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    // Optionally, update cart state to "EMPTY" or delete the cart if desired
    // await prisma.cart.update({
    //   where: { id: cart.id },
    //   data: { state: "EMPTY" }
    // });

    // If you want to delete the cart entirely
    // await prisma.cart.delete({
    //   where: { id: cart.id },
    // });

    res.status(200).json({ message: "Cart deleted successfully" });
  } catch (error) {
    console.error("Error deleting cart:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}


export const addCartItemToCart = async (req: Request, res: Response) => {
  const { cartItemId, cakeId, quantity, sizeId } = req.body;
  if (!cakeId) return res.status(400).json({ message: "cakeId is required" });
  if (!req.user) return res.status(401).json({ message: "User not authenticated" });

  const userId = req.user.id;
  try {
    // Check if the product exists
    const clothes = await prisma.clothes.findUnique({ where: { id: cakeId } });
    if (!clothes) return res.status(404).json({ message: "Clothes not found" });

    // Find or create the user's PENDING cart
    let cart = await prisma.cart.findFirst({ where: { userId: userId, state: State.PENDING } });
    if (!cart) cart = await prisma.cart.create({ data: { userId } });

    // If cartItemId is provided, update only that cart item
    if (cartItemId) {
      console.log("Updating cart item:", cartItemId);
      const cartItem = await prisma.cartItem.findUnique({ where: { id: cartItemId } });
      if (!cartItem || cartItem.cartId !== cart.id) {
        return res.status(404).json({ message: "Cart item not found or does not belong to your cart" });
      }
      const updatedItem = await prisma.cartItem.update({
        where: { id: cartItemId },
        data: { quantity, totalprice: clothes.price * quantity },
      });
      return res.status(200).json({ message: "Cart updated", data: updatedItem });
    } else {
      console.log("Adding new item to cart");
      // If not, check if a cart item with the same ClothesId and sizeId already exists
      const existingItem = await prisma.cartItem.findFirst({
        where: { cartId: cart.id, ClothesId: clothes.id, sizeId },
      });
      if (existingItem) {
        const updatedItem = await prisma.cartItem.update({
          where: { id: existingItem.id },
          data: {
            quantity: existingItem.quantity + 1,
            totalprice: clothes.price * (existingItem.quantity + 1),
          },
        });
        return res.status(200).json({ message: "Cart item quantity incremented", data: updatedItem });
      } else {
        // Otherwise, create a new cart item
        const newItem = await prisma.cartItem.create({
          data: { cartId: cart.id, ClothesId: clothes.id, sizeId, quantity, totalprice: clothes.price * quantity },
        });
        return res.status(201).json({ message: "Item added to cart", data: newItem });
      }
    }
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const viewCartItemInCart = async (req: Request, res: Response) => {
  if (!req.user) return res.status(401).json({ message: "User not authenticated" });

  const userId = req.user.id;

  try {
    // Tìm hoặc tạo giỏ hàng cho người dùng
    let cart = await prisma.cart.findFirst({ where: { userId: userId, state: State.PENDING } });
    
    if (!cart) return res.status(404).json({ message: "Cart not found" });
    else {
      const cartItems = await prisma.cartItem.findMany({
        where: { cartId: cart.id },
        include: { Clothes: { include: { mainImg: true } }, Size: true }
      });
      return res.status(200).json({ cartItems });
    }
  }
  catch (error) {
    console.error("Error getting cart item:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export const updateCartItemInCart = async (req: Request, res: Response) => {
  const { cartItemId, quantity} = req.body;

  if (!req.user) return res.status(401).json({ message: "User not authenticated" });
  const userId = req.user.id;

  try {
    // Find the user's current "PENDING" cart
    const cart = await prisma.cart.findFirst({ 
      where: { userId, state: "PENDING" },
      include: { items: true } 
    });

    if (!cart) return res.status(404).json({ message: "Cart not found" });

    // Check if the cartItem exists and belongs to the user's cart
    const cartItem = await prisma.cartItem.findFirst({
      where: { id: cartItemId, cartId: cart.id },
      include: { Clothes: true },
    });

    if (!cartItem) return res.status(404).json({ message: "Cart item not found" });

    const newTotalPrice = cartItem.Clothes.price * quantity;
    
    // Update the CartItem with the new quantity and total price
    const updatedCartItem = await prisma.cartItem.update({
      where: { id: cartItemId },
      data: { 
        quantity, 
        totalprice: newTotalPrice 
      },
    });

    res.status(200).json({ message: "Cart item updated", cartItem: updatedCartItem });
  } catch (error) {
    console.error("Error updating cart item:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export const deleteCartItemFromCart = async (req: Request, res: Response) => {
  const { cartItemId } = req.body;
  if (!cartItemId) return res.status(400).json({ message: "cartItemId is required" });

  if (!req.user) return res.status(401).json({ message: "User not authenticated" });
  const userId = req.user.id;

  try {
    // Find the user's current "PENDING" cart
    const cart = await prisma.cart.findFirst({ 
      where: { userId, state: "PENDING" },
      include: { items: true },
    });

    if (!cart) return res.status(404).json({ message: "Cart not found" });

    // Delete the CartItem by its id directly
    const cartItem = await prisma.cartItem.findUnique({ where: { id: cartItemId } });
    if (!cartItem || cartItem.cartId !== cart.id) return res.status(404).json({ message: "Cart item not found" });
    await prisma.cartItem.delete({ where: { id: cartItemId } });
    res.status(200).json({ message: "Cart item deleted successfully" });
  } catch (error) {
    console.error("Error deleting cart item:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
