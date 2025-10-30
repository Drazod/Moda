// src/test/cartItem.controller.test.ts
import { Request, Response } from "express";
import * as CartItemController from "../controllers/cartItem.controller";
import { prisma } from "..";

jest.mock("..", () => ({
  prisma: {
    cartItem: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    clothes: {
      findUnique: jest.fn(),
    },
  },
}));

const mockReq = (body = {}, params = {}) =>
  ({ body, params } as unknown as Request);

const mockRes = () => {
  const res = {} as Response;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("CartItem Controller", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  // 1. getCartItem success
  it("getCartItem: should return all cart items", async () => {
    (prisma.cartItem.findMany as jest.Mock).mockResolvedValue([{ id: 1 }]);
    const req = mockReq();
    const res = mockRes();
    await CartItemController.getCartItem(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  // 2. getCartItem error
  it("getCartItem: should handle errors", async () => {
    (prisma.cartItem.findMany as jest.Mock).mockRejectedValue(new Error("DB error"));
    const req = mockReq();
    const res = mockRes();
    await CartItemController.getCartItem(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });

  // 3. getCartItemById success
  it("getCartItemById: should return a cart item", async () => {
    (prisma.cartItem.findUnique as jest.Mock).mockResolvedValue({ id: 1 });
    const req = mockReq({}, { id: "1" });
    const res = mockRes();
    await CartItemController.getCartItemById(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  // 4. getCartItemById not found
  it("getCartItemById: should return 404 if not found", async () => {
    (prisma.cartItem.findUnique as jest.Mock).mockResolvedValue(null);
    const req = mockReq({}, { id: "1" });
    const res = mockRes();
    await CartItemController.getCartItemById(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  // 5. createCartItem success
  it("createCartItem: should create a new cart item", async () => {
    (prisma.clothes.findUnique as jest.Mock).mockResolvedValue({ id: 1, price: 10 });
    (prisma.cartItem.create as jest.Mock).mockResolvedValue({ id: 1 });
    const req = mockReq({ cartId: 1, cakeId: 1, quantity: 2, sizeId: 1 });
    const res = mockRes();
    await CartItemController.createCartItem(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
  });

  // 6. createCartItem clothes not found
  it("createCartItem: should return 404 if clothes not found", async () => {
    (prisma.clothes.findUnique as jest.Mock).mockResolvedValue(null);
    const req = mockReq({ cartId: 1, cakeId: 1, quantity: 2, sizeId: 1 });
    const res = mockRes();
    await CartItemController.createCartItem(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  // 7. createCartItem error
  it("createCartItem: should handle errors", async () => {
    (prisma.clothes.findUnique as jest.Mock).mockRejectedValue(new Error("DB error"));
    const req = mockReq({ cartId: 1, cakeId: 1, quantity: 2, sizeId: 1 });
    const res = mockRes();
    await CartItemController.createCartItem(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });

  // 8. updateCartItem success
  it("updateCartItem: should update cart item", async () => {
    (prisma.cartItem.findUnique as jest.Mock).mockResolvedValue({ id: 1, ClothesId: 1 });
    (prisma.clothes.findUnique as jest.Mock).mockResolvedValue({ id: 1, price: 10 });
    (prisma.cartItem.update as jest.Mock).mockResolvedValue({ id: 1, quantity: 3, totalprice: 30 });
    const req = mockReq({ quantity: 3 }, { id: "1" });
    const res = mockRes();
    await CartItemController.updateCartItem(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  // 9. updateCartItem cartItem not found
  it("updateCartItem: should return 404 if cart item not found", async () => {
    (prisma.cartItem.findUnique as jest.Mock).mockResolvedValue(null);
    const req = mockReq({ quantity: 3 }, { id: "1" });
    const res = mockRes();
    await CartItemController.updateCartItem(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  // 10. updateCartItem clothes not found
  it("updateCartItem: should return 404 if clothes not found", async () => {
    (prisma.cartItem.findUnique as jest.Mock).mockResolvedValue({ id: 1, ClothesId: 1 });
    (prisma.clothes.findUnique as jest.Mock).mockResolvedValue(null);
    const req = mockReq({ quantity: 3 }, { id: "1" });
    const res = mockRes();
    await CartItemController.updateCartItem(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  // 11. updateCartItem error
  it("updateCartItem: should handle errors", async () => {
    (prisma.cartItem.findUnique as jest.Mock).mockRejectedValue(new Error("DB error"));
    const req = mockReq({ quantity: 3 }, { id: "1" });
    const res = mockRes();
    await CartItemController.updateCartItem(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });

  // 12. deleteCartItem success
  it("deleteCartItem: should delete cart item", async () => {
    (prisma.cartItem.findUnique as jest.Mock).mockResolvedValue({ id: 1 });
    (prisma.cartItem.delete as jest.Mock).mockResolvedValue({});
    const req = mockReq({}, { id: "1" });
    const res = mockRes();
    await CartItemController.deleteCartItem(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  // 13. deleteCartItem not found
  it("deleteCartItem: should return 404 if cart item not found", async () => {
    (prisma.cartItem.findUnique as jest.Mock).mockResolvedValue(null);
    const req = mockReq({}, { id: "1" });
    const res = mockRes();
    await CartItemController.deleteCartItem(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  // 14. deleteCartItem error
  it("deleteCartItem: should handle errors", async () => {
    (prisma.cartItem.findUnique as jest.Mock).mockRejectedValue(new Error("DB error"));
    const req = mockReq({}, { id: "1" });
    const res = mockRes();
    await CartItemController.deleteCartItem(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });

  // 15. getCartItemById error
  it("getCartItemById: should handle errors", async () => {
    (prisma.cartItem.findUnique as jest.Mock).mockRejectedValue(new Error("DB error"));
    const req = mockReq({}, { id: "1" });
    const res = mockRes();
    await CartItemController.getCartItemById(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });
});
