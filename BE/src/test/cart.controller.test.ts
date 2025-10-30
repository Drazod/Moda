// src/test/cart.controller.test.ts
import { Request, Response } from "express";
import * as CartController from "../controllers/cart.controller";
import { prisma } from "..";

jest.mock("..", () => ({
  prisma: {
    cart: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    cartItem: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      deleteMany: jest.fn(),
    },
    clothes: {
      findUnique: jest.fn(),
    },
  },
}));

const mockReq = (body = {}, params = {}, user = {}, headers = {}) =>
  ({ body, params, user, headers } as unknown as Request);

const mockRes = () => {
  const res = {} as Response;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};
const mockReqNoUser = (body = {}, params = {}, headers = {}) =>
  ({ body, params, headers } as unknown as Request);

describe("Cart Controller", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  // 1. getCart as admin
  it("getCart: should return all carts for admin", async () => {
    (prisma.cart.findMany as jest.Mock).mockResolvedValue([{ id: 1 }]);
    const req = mockReq({}, {}, { id: 1, role: "ADMIN" });
    const res = mockRes();
    await CartController.getCart(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  // 2. getCart as user
  it("getCart: should return pending carts for user", async () => {
    (prisma.cart.findMany as jest.Mock).mockResolvedValue([{ id: 2 }]);
    const req = mockReq({}, {}, { id: 2, role: "USER" });
    const res = mockRes();
    await CartController.getCart(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  // 3. getCart user not authenticated
  it("getCart: should return 401 if not authenticated", async () => {
    const req = mockReqNoUser();
    const res = mockRes();
    await CartController.getCart(req, res);
    expect(res.status).toHaveBeenCalledWith(401);
  });

  // 4. getCartById success
  it("getCartById: should return a cart by id", async () => {
    (prisma.cart.findUnique as jest.Mock).mockResolvedValue({ id: 1 });
    const req = mockReq({}, { id: "1" });
    const res = mockRes();
    await CartController.getCartById(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  // 5. getCartById not found
  it("getCartById: should return 404 if cart not found", async () => {
    (prisma.cart.findUnique as jest.Mock).mockResolvedValue(null);
    const req = mockReq({}, { id: "1" });
    const res = mockRes();
    await CartController.getCartById(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  // 6. createCart existing cart
  it("createCart: should return existing cart if PENDING exists", async () => {
    (prisma.cart.findFirst as jest.Mock).mockResolvedValue({ id: 1 });
    const req = mockReq({}, {}, { id: 1 });
    const res = mockRes();
    await CartController.createCart(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  // 7. createCart new cart
  it("createCart: should create new cart", async () => {
    (prisma.cart.findFirst as jest.Mock).mockResolvedValue(null);
    (prisma.cart.create as jest.Mock).mockResolvedValue({ id: 2 });
    const req = mockReq({}, {}, { id: 2 });
    const res = mockRes();
    await CartController.createCart(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
  });

  // 8. createCart unauthenticated
  it("createCart: should return 401 if not authenticated", async () => {
    const req = mockReqNoUser();
    const res = mockRes();
    await CartController.createCart(req, res);
    expect(res.status).toHaveBeenCalledWith(401);
  });

  // 9. updateCart success
  it("updateCart: should update a cart", async () => {
    (prisma.cart.update as jest.Mock).mockResolvedValue({ id: 1 });
    const req = mockReq({ userId: 3 }, { id: "1" });
    const res = mockRes();
    await CartController.updateCart(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  // 10. placeOrder success
  it("placeOrder: should update cart state to ORDERED", async () => {
    (prisma.cartItem.findMany as jest.Mock).mockResolvedValue([{ id: 1 }]);
    (prisma.cart.update as jest.Mock).mockResolvedValue({ id: 1, state: "ORDERED" });
    const req = mockReq({}, { id: "1" }, { id: 1 });
    const res = mockRes();
    await CartController.placeOrder(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  // 11. deleteCart success
  it("deleteCart: should delete user's pending cart", async () => {
    (prisma.cart.findFirst as jest.Mock).mockResolvedValue({ id: 1 });
    (prisma.cartItem.deleteMany as jest.Mock).mockResolvedValue({});
    const req = mockReq({}, {}, { id: 1 });
    const res = mockRes();
    await CartController.deleteCart(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  // 12. deleteCart not found
  it("deleteCart: should return 404 if no pending cart", async () => {
    (prisma.cart.findFirst as jest.Mock).mockResolvedValue(null);
    const req = mockReq({}, {}, { id: 1 });
    const res = mockRes();
    await CartController.deleteCart(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  // 13. addCartItemToCart missing cakeId
  it("addCartItemToCart: should return 400 if cakeId missing", async () => {
    const req = mockReq({}, {}, { id: 1 });
    const res = mockRes();
    await CartController.addCartItemToCart(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  // 14. addCartItemToCart clothes not found
  it("addCartItemToCart: should return 404 if clothes not found", async () => {
    (prisma.clothes.findUnique as jest.Mock).mockResolvedValue(null);
    const req = mockReq({ cakeId: 1 }, {}, { id: 1 });
    const res = mockRes();
    await CartController.addCartItemToCart(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  // 15. viewCartItemInCart success
  it("viewCartItemInCart: should return cart items", async () => {
    (prisma.cart.findFirst as jest.Mock).mockResolvedValue({ id: 1 });
    (prisma.cartItem.findMany as jest.Mock).mockResolvedValue([{ id: 1 }]);
    const req = mockReq({}, {}, { id: 1 });
    const res = mockRes();
    await CartController.viewCartItemInCart(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  // 16. viewCartItemInCart not found
  it("viewCartItemInCart: should return 404 if cart not found", async () => {
    (prisma.cart.findFirst as jest.Mock).mockResolvedValue(null);
    const req = mockReq({}, {}, { id: 1 });
    const res = mockRes();
    await CartController.viewCartItemInCart(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  // 17. updateCartItemInCart success
  it("updateCartItemInCart: should update cart item quantity", async () => {
    (prisma.cart.findFirst as jest.Mock).mockResolvedValue({ id: 1 });
    (prisma.cartItem.findFirst as jest.Mock).mockResolvedValue({ id: 1, Clothes: { price: 10 }, cartId: 1 });
    (prisma.cartItem.update as jest.Mock).mockResolvedValue({ id: 1, quantity: 2, totalprice: 20 });
    const req = mockReq({ cartItemId: 1, quantity: 2 }, {}, { id: 1 });
    const res = mockRes();
    await CartController.updateCartItemInCart(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  // 18. deleteCartItemFromCart success
  it("deleteCartItemFromCart: should delete cart item", async () => {
    (prisma.cart.findFirst as jest.Mock).mockResolvedValue({ id: 1 });
    (prisma.cartItem.findUnique as jest.Mock).mockResolvedValue({ id: 1, cartId: 1 });
    (prisma.cartItem.delete as jest.Mock).mockResolvedValue({});
    const req = mockReq({ cartItemId: 1 }, {}, { id: 1 });
    const res = mockRes();
    await CartController.deleteCartItemFromCart(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  // 19. deleteCartItemFromCart cartItem not found
  it("deleteCartItemFromCart: should return 404 if cartItem not found", async () => {
    (prisma.cart.findFirst as jest.Mock).mockResolvedValue({ id: 1 });
    (prisma.cartItem.findUnique as jest.Mock).mockResolvedValue(null);
    const req = mockReq({ cartItemId: 1 }, {}, { id: 1 });
    const res = mockRes();
    await CartController.deleteCartItemFromCart(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  // 20. deleteCartItemFromCart missing cartItemId
  it("deleteCartItemFromCart: should return 400 if cartItemId missing", async () => {
    const req = mockReq({}, {}, { id: 1 });
    const res = mockRes();
    await CartController.deleteCartItemFromCart(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });
});
