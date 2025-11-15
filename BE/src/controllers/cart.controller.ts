import { Request, Response } from "express";
import { prisma } from ".."; 
import { State } from "@prisma/client";
const CART_ITEM_INCLUDE = {
  Clothes: { include: { mainImg: true } },
  Size: true,
  sourceBranch: {
    select: {
      id: true,
      code: true,
      name: true,
      address: true,
      phone: true,
    }
  },
  pickupBranch: {
    select: {
      id: true,
      code: true,
      name: true,
      address: true,
      phone: true,
    }
  }
} as const;
export const getCart = async (req: Request, res: Response) => {
  if (!req.user) return res.status(401).json({ message: "User not authenticated" });

  try {
    let carts;

    if (req.user.role === "ADMIN") {
      // Admin can see all carts
      carts = await prisma.cart.findMany({
        include: {
          items: {
            include: CART_ITEM_INCLUDE,
          },
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            }
          }
        },
      });
    } else {
      // Regular users only see their own PENDING cart
      carts = await prisma.cart.findMany({
        where: { userId: req.user.id, state: "PENDING" },
        include: {
          items: {
            include: CART_ITEM_INCLUDE,
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
            include: CART_ITEM_INCLUDE,
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
  const { id } = req.params;

  try {
    // Get cart with all items and fulfillment details
    const cart = await prisma.cart.findUnique({
      where: { id: parseInt(id) },
      include: {
        items: {
          include: CART_ITEM_INCLUDE
        }
      }
    });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    if (cart.items.length === 0) {
      return res.status(400).json({ message: "Cannot place order with empty cart" });
    }

    // Update cart state to ORDERED
    const updatedCart = await prisma.cart.update({
      where: { id: parseInt(id) },
      data: { state: "ORDERED" },
      include: {
        items: {
          include: CART_ITEM_INCLUDE
        }
      }
    });

    res.status(200).json({ 
      message: "Order placed successfully",
      cart: updatedCart 
    });
  } catch (error) {
    console.error("Error placing order:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

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
  const { 
    cartItemId, 
    cakeId, 
    quantity = 1, 
    sizeId,
    fulfillmentMethod = 'ship',
    sourceBranchId,
    pickupBranchId,
    needsTransfer = false,
    estimatedDate,
    allocationNote
  } = req.body;
  
  // Validation
  if (!cakeId) return res.status(400).json({ message: "cakeId is required" });
  if (!sizeId) return res.status(400).json({ message: "sizeId is required" });
  if (!req.user) return res.status(401).json({ message: "User not authenticated" });
  if (fulfillmentMethod === 'pickup' && !pickupBranchId) {
    return res.status(400).json({ message: "pickupBranchId is required for pickup fulfillment" });
  }

  const userId = req.user.id;

  try {
    // Verify product exists
    const clothes = await prisma.clothes.findUnique({ where: { id: cakeId } });
    if (!clothes) return res.status(404).json({ message: "Clothes not found" });

    // Verify branches exist if provided
    if (sourceBranchId) {
      const branch = await prisma.branch.findUnique({ where: { id: sourceBranchId } });
      if (!branch) return res.status(404).json({ message: "Source branch not found" });
    }
    if (pickupBranchId) {
      const branch = await prisma.branch.findUnique({ where: { id: pickupBranchId } });
      if (!branch) return res.status(404).json({ message: "Pickup branch not found" });
    }

    // Find or create user's pending cart
    let cart = await prisma.cart.findFirst({ 
      where: { userId, state: State.PENDING } 
    });
    if (!cart) {
      cart = await prisma.cart.create({ data: { userId } });
    }

    // Prepare fulfillment data
    const fulfillmentData = {
      fulfillmentMethod,
      sourceBranchId: sourceBranchId || null,
      pickupBranchId: pickupBranchId || null,
      needsTransfer,
      estimatedDate: estimatedDate ? new Date(estimatedDate) : null,
      allocationNote: allocationNote || null,
    };

    const itemData = {
      quantity, 
      totalprice: clothes.price * quantity,
      ...fulfillmentData
    };

    // Update existing cart item
    if (cartItemId) {
      const cartItem = await prisma.cartItem.findUnique({ where: { id: cartItemId } });
      if (!cartItem || cartItem.cartId !== cart.id) {
        return res.status(404).json({ message: "Cart item not found or does not belong to your cart" });
      }
      
      const updatedItem = await prisma.cartItem.update({
        where: { id: cartItemId },
        data: itemData,
        include: CART_ITEM_INCLUDE,
      });
      
      return res.status(200).json({ message: "Cart item updated", data: updatedItem });
    }

    // Check for existing cart item with same details
    const existingCartItems = await prisma.cartItem.findMany({
      where: { 
        cartId: cart.id, 
        ClothesId: cakeId, 
        sizeId,
      },
    });
    
    // Find exact match (same fulfillment details)
    const existingItem = existingCartItems.find(item => {
      const i = item as any;
      return (
        i.fulfillmentMethod === fulfillmentMethod &&
        i.sourceBranchId === (sourceBranchId || null) &&
        i.pickupBranchId === (pickupBranchId || null)
      );
    });
    
    if (existingItem) {
      // Increment existing item
      const updatedItem = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: {
          quantity: existingItem.quantity + 1,
          totalprice: clothes.price * (existingItem.quantity + 1),
          ...fulfillmentData
        },
        include: CART_ITEM_INCLUDE,
      });
      
      return res.status(200).json({ message: "Cart item quantity updated", data: updatedItem });
    }
    
    // Create new cart item
    const newItem = await prisma.cartItem.create({
      data: { 
        cartId: cart.id, 
        ClothesId: cakeId, 
        sizeId,
        ...itemData
      },
      include: CART_ITEM_INCLUDE,
    });
    
    return res.status(201).json({ message: "Item added to cart", data: newItem });
    
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const viewCartItemInCart = async (req: Request, res: Response) => {
  if (!req.user) return res.status(401).json({ message: "User not authenticated" });

  const userId = req.user.id;

  try {
    // Find user's pending cart
    const cart = await prisma.cart.findFirst({ 
      where: { userId, state: State.PENDING } 
    });
    
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    
    const cartItems = await prisma.cartItem.findMany({
      where: { cartId: cart.id },
      include: CART_ITEM_INCLUDE
    });
    
    return res.status(200).json({ cartItems });
  } catch (error) {
    console.error("Error getting cart items:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateCartItemInCart = async (req: Request, res: Response) => {
  const { 
    cartItemId, 
    quantity,
    fulfillmentMethod,
    sourceBranchId,
    pickupBranchId,
    needsTransfer,
    estimatedDate,
    allocationNote
  } = req.body;

  if (!req.user) return res.status(401).json({ message: "User not authenticated" });
  if (!cartItemId) return res.status(400).json({ message: "cartItemId is required" });

  const userId = req.user.id;

  try {
    // Find user's pending cart
    const cart = await prisma.cart.findFirst({ 
      where: { userId, state: "PENDING" },
      include: { items: true } 
    });

    if (!cart) return res.status(404).json({ message: "Cart not found" });

    // Verify cart item exists and belongs to user's cart
    const cartItem = await prisma.cartItem.findFirst({
      where: { id: cartItemId, cartId: cart.id },
      include: { Clothes: true },
    });

    if (!cartItem) return res.status(404).json({ message: "Cart item not found" });

    // Prepare update data
    const updateData: any = {};
    
    if (quantity !== undefined) {
      updateData.quantity = quantity;
      updateData.totalprice = cartItem.Clothes.price * quantity;
    }
    
    if (fulfillmentMethod !== undefined) updateData.fulfillmentMethod = fulfillmentMethod;
    if (sourceBranchId !== undefined) updateData.sourceBranchId = sourceBranchId || null;
    if (pickupBranchId !== undefined) updateData.pickupBranchId = pickupBranchId || null;
    if (needsTransfer !== undefined) updateData.needsTransfer = needsTransfer;
    if (estimatedDate !== undefined) updateData.estimatedDate = estimatedDate ? new Date(estimatedDate) : null;
    if (allocationNote !== undefined) updateData.allocationNote = allocationNote || null;

    // Update cart item
    const updatedCartItem = await prisma.cartItem.update({
      where: { id: cartItemId },
      data: updateData,
      include: CART_ITEM_INCLUDE,
    });

    res.status(200).json({ message: "Cart item updated", cartItem: updatedCartItem });
  } catch (error) {
    console.error("Error updating cart item:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

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
