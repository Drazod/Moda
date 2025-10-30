// src/test/coupon.controller.test.ts
import { Request, Response } from "express";
import * as CouponController from "../controllers/coupon.controller";
import { prisma } from "..";

jest.mock("..", () => ({
  prisma: {
    coupon: {
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
    },
    transaction: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
    },
    cart: {
      update: jest.fn(),
    },
  },
}));

const mockReq = (body = {}, params = {}, user?: any) =>
  ({ body, params, user } as unknown as Request);

const mockRes = () => {
  const res = {} as Response;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("Coupon Controller", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  // 1. createCoupon success
  it("createCoupon: should create a coupon", async () => {
    (prisma.coupon.create as jest.Mock).mockResolvedValue({ id: 1, couponCode: "ABC123" });
    const req = mockReq({ couponCode: "ABC123", description: "Test", discount: 10, expiryDate: new Date(), stock: 5 });
    const res = mockRes();
    await CouponController.createCoupon(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
  });

  // 2. createCoupon error
  it("createCoupon: should handle error", async () => {
    (prisma.coupon.create as jest.Mock).mockRejectedValue(new Error("DB error"));
    const req = mockReq({ couponCode: "ABC123" });
    const res = mockRes();
    await CouponController.createCoupon(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });

  // 3. updateCoupon success
  it("updateCoupon: should update a coupon", async () => {
    (prisma.coupon.update as jest.Mock).mockResolvedValue({ id: 1, couponCode: "NEW123" });
    const req = mockReq({ couponCode: "NEW123" }, { id: "1" });
    const res = mockRes();
    await CouponController.updateCoupon(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  // 4. updateCoupon error
  it("updateCoupon: should handle error", async () => {
    (prisma.coupon.update as jest.Mock).mockRejectedValue(new Error("DB error"));
    const req = mockReq({}, { id: "1" });
    const res = mockRes();
    await CouponController.updateCoupon(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });

  // 5. deleteCoupon success
  it("deleteCoupon: should delete a coupon", async () => {
    (prisma.coupon.delete as jest.Mock).mockResolvedValue({});
    const req = mockReq({}, { id: "1" });
    const res = mockRes();
    await CouponController.deleteCoupon(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  // 6. deleteCoupon error
  it("deleteCoupon: should handle error", async () => {
    (prisma.coupon.delete as jest.Mock).mockRejectedValue(new Error("DB error"));
    const req = mockReq({}, { id: "1" });
    const res = mockRes();
    await CouponController.deleteCoupon(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });

  // 7. getAllCouponsForAdmin success
  it("getAllCouponsForAdmin: should return all coupons", async () => {
    (prisma.coupon.findMany as jest.Mock).mockResolvedValue([{ id: 1 }]);
    const req = mockReq();
    const res = mockRes();
    await CouponController.getAllCouponsForAdmin(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  // 8. getAllCouponsForAdmin error
  it("getAllCouponsForAdmin: should handle error", async () => {
    (prisma.coupon.findMany as jest.Mock).mockRejectedValue(new Error("DB error"));
    const req = mockReq();
    const res = mockRes();
    await CouponController.getAllCouponsForAdmin(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });

  // 9. getAvailableCoupons success
  it("getAvailableCoupons: should return available coupons", async () => {
    (prisma.transaction.findMany as jest.Mock).mockResolvedValue([{ couponCode: "ABC123" }]);
    (prisma.coupon.findMany as jest.Mock).mockResolvedValue([{ couponCode: "XYZ789" }]);
    const req = mockReq({}, {}, { id: 1 });
    const res = mockRes();
    await CouponController.getAvailableCoupons(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  // 10. getAvailableCoupons unauthenticated
  it("getAvailableCoupons: should return 401 if user not authenticated", async () => {
    const req = mockReq();
    const res = mockRes();
    await CouponController.getAvailableCoupons(req, res);
    expect(res.status).toHaveBeenCalledWith(401);
  });

  // 11. getAvailableCoupons error
  it("getAvailableCoupons: should handle error", async () => {
    (prisma.transaction.findMany as jest.Mock).mockRejectedValue(new Error("DB error"));
    const req = mockReq({}, {}, { id: 1 });
    const res = mockRes();
    await CouponController.getAvailableCoupons(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });

  // 12. applyCouponToCart success
  it("applyCouponToCart: should apply coupon successfully", async () => {
    const now = new Date();
    (prisma.coupon.findUnique as jest.Mock).mockResolvedValue({ couponCode: "ABC", isActive: true, expiryDate: new Date(now.getTime() + 1000), stock: 1 });
    (prisma.transaction.findFirst as jest.Mock).mockResolvedValue(null);
    (prisma.cart.update as jest.Mock).mockResolvedValue({});
    const req = mockReq({ cartId: 1, couponCode: "ABC" }, {}, { id: 1 });
    const res = mockRes();
    await CouponController.applyCouponToCart(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  // 13. applyCouponToCart unauthenticated
  it("applyCouponToCart: should return 401 if user not authenticated", async () => {
    const req = mockReq({ cartId: 1, couponCode: "ABC" });
    const res = mockRes();
    await CouponController.applyCouponToCart(req, res);
    expect(res.status).toHaveBeenCalledWith(401);
  });

  // 14. applyCouponToCart coupon not available
  it("applyCouponToCart: should return 400 if coupon invalid", async () => {
    (prisma.coupon.findUnique as jest.Mock).mockResolvedValue(null);
    const req = mockReq({ cartId: 1, couponCode: "ABC" }, {}, { id: 1 });
    const res = mockRes();
    await CouponController.applyCouponToCart(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  // 15. applyCouponToCart coupon already used
  it("applyCouponToCart: should return 400 if coupon already used", async () => {
    const now = new Date();
    (prisma.coupon.findUnique as jest.Mock).mockResolvedValue({ couponCode: "ABC", isActive: true, expiryDate: new Date(now.getTime() + 1000), stock: 1 });
    (prisma.transaction.findFirst as jest.Mock).mockResolvedValue({ id: 1 });
    const req = mockReq({ cartId: 1, couponCode: "ABC" }, {}, { id: 1 });
    const res = mockRes();
    await CouponController.applyCouponToCart(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  // 16. applyCouponToCart error
  it("applyCouponToCart: should handle error", async () => {
    (prisma.coupon.findUnique as jest.Mock).mockRejectedValue(new Error("DB error"));
    const req = mockReq({ cartId: 1, couponCode: "ABC" }, {}, { id: 1 });
    const res = mockRes();
    await CouponController.applyCouponToCart(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });
});
