import { Request, Response } from "express";
import { prisma } from "..";

// Admin: Create new coupon
export const createCoupon = async (req: Request, res: Response) => {
  try {
    const { couponCode, description, discount, expiryDate, stock } = req.body;
    const coupon = await prisma.coupon.create({
      data: { couponCode, description, discount, expiryDate, stock, isActive: true },
    });
    res.status(201).json({ message: "Coupon created", coupon });
  } catch (error) {
    res.status(500).json({ message: "Error creating coupon", error });
  }
};

// Admin: Update coupon
export const updateCoupon = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { couponCode, description, discount, expiryDate, stock, isActive } = req.body;
    const coupon = await prisma.coupon.update({
      where: { id: parseInt(id) },
      data: { couponCode, description, discount, expiryDate, stock, isActive },
    });
    res.status(200).json({ message: "Coupon updated", coupon });
  } catch (error) {
    res.status(500).json({ message: "Error updating coupon", error });
  }
};

// Admin: Delete coupon
export const deleteCoupon = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.coupon.delete({ where: { id: parseInt(id) } });
    res.status(200).json({ message: "Coupon deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting coupon", error });
  }
};

// Admin: Get all coupons (no user filter)
export const getAllCouponsForAdmin = async (req: Request, res: Response) => {
  try {
    const coupons = await prisma.coupon.findMany();
    res.status(200).json({ coupons });
  } catch (error) {
    res.status(500).json({ message: "Error fetching coupons", error });
  }
};

// User: Get available coupons
export const getAvailableCoupons = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "User not authenticated" });
    const now = new Date();
    // Get all coupon codes the user has used
    const usedCoupons = await prisma.transaction.findMany({
      where: { userId, couponCode: { not: null } },
      select: { couponCode: true },
    });
    const usedCodes = usedCoupons.map(t => t.couponCode);
    // Get all available coupons that the user has NOT used
    const coupons = await prisma.coupon.findMany({
      where: {
        isActive: true,
        expiryDate: { gt: now },
        stock: { gt: 0 },
        couponCode: { notIn: usedCodes.filter((c): c is string => !!c) },
      },
    });
    res.status(200).json({ coupons });
  } catch (error) {
    res.status(500).json({ message: "Error fetching coupons", error });
  }
};

// User: Apply coupon to cart (one time per user)
export const applyCouponToCart = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const { cartId, couponCode } = req.body;
    if (!userId) return res.status(401).json({ message: "User not authenticated" });
    // Check if coupon exists and is available
    const coupon = await prisma.coupon.findUnique({ where: { couponCode } });
    if (!coupon || !coupon.isActive || coupon.expiryDate < new Date() || coupon.stock <= 0) {
      return res.status(400).json({ message: "Coupon is not available" });
    }
    // Check if user has already used this coupon
    const used = await prisma.transaction.findFirst({
      where: { userId, couponCode },
    });
    if (used) {
      return res.status(400).json({ message: "You have already used this coupon" });
    }
    // Apply coupon to cart (store couponCode in cart or session)
    await prisma.cart.update({
      where: { id: cartId },
      data: { couponCode },
    });
    res.status(200).json({ message: "Coupon applied to cart" });
  } catch (error) {
    res.status(500).json({ message: "Error applying coupon", error });
  }
};
