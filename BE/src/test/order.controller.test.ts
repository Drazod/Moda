// src/test/order.controller.test.ts
import { prisma } from "..";
import { getOrderListForAdmin } from "../controllers/order.controller";
import { Request, Response } from "express";

jest.mock("..", () => ({
  prisma: {
    transaction: {
      findMany: jest.fn(),
    },
  },
}));

const mockReq = () => ({} as Request);
const mockRes = () => {
  const res = {} as Response;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("Order Controller", () => {
  afterEach(() => jest.clearAllMocks());

  describe("getOrderListForAdmin", () => {
    it("should return formatted orders", async () => {
      const fakeTransactions = [
        {
          id: 1,
          createdAt: new Date("2025-01-01"),
          amount: 100,
          user: { name: "Alice" },
          shipping: [{ State: "Shipped" }],
        },
        {
          id: 2,
          createdAt: new Date("2025-01-02"),
          amount: 50,
          user: null,
          shipping: [],
        },
      ];
      (prisma.transaction.findMany as jest.Mock).mockResolvedValue(fakeTransactions);

      const req = mockReq();
      const res = mockRes();

      await getOrderListForAdmin(req, res);

      expect(prisma.transaction.findMany).toHaveBeenCalledWith({
        include: { user: true, shipping: true },
        orderBy: { createdAt: "asc" },
      });

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        orders: [
          {
            orderId: 1,
            customerName: "Alice",
            date: fakeTransactions[0].createdAt,
            status: "Shipped",
            price: 100,
          },
          {
            orderId: 2,
            customerName: "Unknown",
            date: fakeTransactions[1].createdAt,
            status: "N/A",
            price: 50,
          },
        ],
      });
    });

    it("should handle errors", async () => {
      (prisma.transaction.findMany as jest.Mock).mockRejectedValue(new Error("DB error"));

      const req = mockReq();
      const res = mockRes();

      await getOrderListForAdmin(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: "Error fetching orders" })
      );
    });
  });
});
