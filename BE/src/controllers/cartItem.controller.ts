import { Request, Response } from "express";
import { prisma } from ".."; 
import { State } from "@prisma/client";
import { createCart } from "./cart.controller";

export const getCartItem = async (req: Request, res: Response) => {
  try {
    const cartItem = await prisma.cartItem.findMany({
      include: {
        cake: true,
        cart: true
      },
    });

    res.status(200).json({ cartItem });
  } catch (error) {
    console.error("Error getting cart item:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export const getCartItemById = async (req: Request, res: Response) => {
    const { id } = req.params;
    
    try {
        const cartItem = await prisma.cartItem.findUnique({
        where: { id: parseInt(id) },
        include: {
            cake: true,
            cart: true
        },
        });
    
        if (!cartItem) {
        return res.status(404).json({ message: "Cart item not found" });
        }
    
        res.status(200).json({ cartItem });
    } catch (error) {
        console.error("Error getting cart item:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const createCartItem = async (req: Request, res: Response) => {
    const { cartId, cakeId, quantity } = req.body;
    try {
        const cake = await prisma.cake.findUnique({ where: { id: cakeId } });
        
        if (!cake) {
            return res.status(404).json({ message: "Cake not found" });
        }

        const totalprice = cake.price * quantity;

        const cartItem = await prisma.cartItem.create({
            data: {
                cartId,
                cakeId,
                quantity,
                totalprice
            },
        });
    
        res.status(201).json({ cartItem });
    } catch (error) {
        console.error("Error creating cart item:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const updateCartItem = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { quantity } = req.body;
    try {
        const cartItem = await prisma.cartItem.findUnique({ where: { id: parseInt(id) } });
        
        if (!cartItem) {
            return res.status(404).json({ message: "Cart item not found" });
        }

        const cake = await prisma.cake.findUnique({ where: { id: cartItem.cakeId } });

        if (!cake) {
            return res.status(404).json({ message: "Cake not found" });
        }

        const totalprice = cake.price * quantity;

        const updatedCartItem  = await prisma.cartItem.update({
            where: { id: parseInt(id) },
            data: {
                quantity,
                totalprice
            },
        });
    
        res.status(200).json({ updatedCartItem });
    } catch (error) {
        console.error("Error updating cart item:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const deleteCartItem = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const cartItem = await prisma.cartItem.findUnique({ where: { id: parseInt(id) } });
        
        if (!cartItem) {
            return res.status(404).json({ message: "Cart item not found" });
        }

        await prisma.cartItem.delete({ where: { id: parseInt(id) } });
    
        res.status(200).json({ message: "Cart item deleted" });
    } catch (error) {
        console.error("Error deleting cart item:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
