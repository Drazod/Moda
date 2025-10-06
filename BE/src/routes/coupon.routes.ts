import { Router } from "express";
import {
  createCoupon,
  updateCoupon,
  deleteCoupon,
  getAvailableCoupons,
  applyCouponToCart,
  getAllCouponsForAdmin
} from "../controllers/coupon.controller";
import authMiddleware from "../middlewares/authentication";
import authorize from "../middlewares/authorization";

const couponRoute = Router();

// Admin routes
couponRoute.post("/", authMiddleware, authorize(["ADMIN", "HOST"]), createCoupon);
couponRoute.put("/:id", authMiddleware, authorize(["ADMIN", "HOST"]), updateCoupon);
couponRoute.delete("/:id", authMiddleware, authorize(["ADMIN", "HOST"]), deleteCoupon);

// Admin: Get all coupons
couponRoute.get("/admin-list", authMiddleware, authorize(["ADMIN", "HOST"]), getAllCouponsForAdmin);

// User routes
couponRoute.get("/available", authMiddleware, getAvailableCoupons);
// couponRoute.post("/apply", authMiddleware, applyCouponToCart);

export default couponRoute;
