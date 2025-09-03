import { Request, Response } from "express";
import { prisma } from ".."; 
import { State } from "@prisma/client";

export const getCart = async (req: Request, res: Response) => {
  
  if (!req.user) return res.status(401).json({ message: "User not authenticated" });
  const userId = req.user.id;
  try {
    const cart = await prisma.cart.findFirst({ 
      where: { userId, state: "PENDING" },
      include: {
        items: {
          include: {
            cake: true,
          },
        },
      }, 
    });
    res.status(200).json({ cart });
  } catch (error) {
    console.error("Error getting cart:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export const getCartById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const cart = await prisma.cart.findUnique({
      where: { id: parseInt(id) },
      include: {
        items: {
          include: {
            cake: true,
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
  const { id } = req.params;
  // const { userId } = req.body;
  try {
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
  const { cakeId, quantity } = req.body;
  if (!req.user) return res.status(401).json({ message: "User not authenticated" });

  const userId = req.user.id;
  try {
      // Kiểm tra xem bánh có tồn tại không
      const cake = await prisma.cake.findUnique({ where: { id: cakeId } });
      if (!cake) return res.status(404).json({ message: "Cake not found" });
      // Tìm hoặc tạo giỏ hàng cho người dùng
      let cart = await prisma.cart.findFirst({ where: { userId: userId, state: State.PENDING } });
      if (!cart) cart = await prisma.cart.create({ data: { userId } });

      const existingItem = await prisma.cartItem.findFirst({
          where: { cartId: cart.id, cakeId },
      });
      const new_quantity = existingItem ? existingItem.quantity + quantity : quantity;  
          
      if (existingItem) {
          const updatedItem = await prisma.cartItem.update({
              where: { id: existingItem.id },
              data: { quantity: new_quantity, totalprice: cake.price * (existingItem.quantity + quantity) },
          });
          return res.status(200).json({ message: "Cart updated", data: updatedItem });
      } else {
          const newItem = await prisma.cartItem.create({
              data: { cartId: cart.id, cakeId, quantity: new_quantity, totalprice: cake.price * new_quantity },
          });
          return res.status(201).json({ message: "Item added to cart", data: newItem });
          }
      } catch (error) {
          console.error("Error adding to cart:", error);
          res.status(500).json({ message: "Internal server error" });
      }
  }

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
        include: { cake: true },
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
      include: { cake: true },
    });

    if (!cartItem) return res.status(404).json({ message: "Cart item not found" });

    const newTotalPrice = cartItem.cake.price * quantity;
    
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

  if (!req.user) return res.status(401).json({ message: "User not authenticated" });
  const userId = req.user.id;

  try {
    // Find the user's current "PENDING" cart
    const cart = await prisma.cart.findFirst({ 
      where: { userId, state: "PENDING" },
      include: { items: true },
    });

    if (!cart) return res.status(404).json({ message: "Cart not found" });

    // Check if the cartItem exists and belongs to the user's cart
    const cartItem = await prisma.cartItem.findFirst({
      where: { id: cartItemId, cartId: cart.id },
    });

    if (!cartItem) return res.status(404).json({ message: "Cart item not found" });

    // Delete the CartItem
    await prisma.cartItem.delete({
      where: { id: cartItemId },
    });

    res.status(200).json({ message: "Cart item deleted successfully" });
  } catch (error) {
    console.error("Error deleting cart item:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
