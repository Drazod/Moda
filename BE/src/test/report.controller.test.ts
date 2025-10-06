// src/test/products.controller.test.ts
import { prisma } from "..";
import { productsSalesReport } from "../controllers/report.controller";
import { Request, Response } from "express";

jest.mock("..", () => ({
  prisma: {
    clothes: {
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

describe("productsSalesReport", () => {
  afterEach(() => jest.clearAllMocks());

  it("should return sales report with totalSold and lastBuyDate", async () => {
    const fakeProducts = [
      {
        id: 1,
        name: "Shirt",
        category: { id: 10, name: "Clothes" },
        transactionDetails: [
          { quantity: 2, transaction: { createdAt: new Date("2025-01-01") } },
          { quantity: 3, transaction: { createdAt: new Date("2025-01-03") } },
        ],
      },
      {
        id: 2,
        name: "Pants",
        category: { id: 11, name: "Clothes" },
        transactionDetails: [],
      },
    ];
    (prisma.clothes.findMany as jest.Mock).mockResolvedValue(fakeProducts);

    const req = mockReq();
    const res = mockRes();

    await productsSalesReport(req, res);

    expect(prisma.clothes.findMany).toHaveBeenCalledWith({
      include: {
        transactionDetails: { include: { transaction: true } },
        category: true,
      },
    });

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith([
      {
        id: 1,
        name: "Shirt",
        category: { id: 10, name: "Clothes" },
        totalSold: 5,
        lastBuyDate: new Date("2025-01-03"),
      },
      {
        id: 2,
        name: "Pants",
        category: { id: 11, name: "Clothes" },
        totalSold: 0,
        lastBuyDate: null,
      },
    ]);
  });

  it("should handle errors", async () => {
    (prisma.clothes.findMany as jest.Mock).mockRejectedValue(new Error("DB error"));

    const req = mockReq();
    const res = mockRes();

    await productsSalesReport(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "Internal server error" });
  });
});
