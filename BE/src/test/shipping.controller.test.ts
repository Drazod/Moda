// src/test/shipping.controller.test.ts
import { updateShippingState } from "../controllers/shipping.controller";
import { prisma } from "../index"; // hoặc đường dẫn chính xác tới prisma instance
import { createOrderNoticeForUser } from "../controllers/notice.controller";

jest.mock("../index", () => ({
  prisma: {
    shipping: { update: jest.fn() },
    transaction: { findUnique: jest.fn() },
  },
}));

jest.mock("../controllers/notice.controller", () => ({
  createOrderNoticeForUser: jest.fn(),
}));

const mockReq = (params: any, body: any) => ({
  params,
  body,
} as unknown as import("express").Request);

const mockRes = () => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("updateShippingState", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should update shipping and create a notice for user", async () => {
    const req = mockReq({ id: "1" }, { state: "SHIPPING" });
    const res = mockRes();

    (prisma.shipping.update as jest.Mock).mockResolvedValue({ State: "SHIPPING" });
    (prisma.transaction.findUnique as jest.Mock).mockResolvedValue({ userId: 123 });
    (createOrderNoticeForUser as jest.Mock).mockResolvedValue(undefined);

    await updateShippingState(req, res);

    expect(prisma.shipping.update).toHaveBeenCalledWith({
      where: { transId: 1 },
      data: { State: "SHIPPING" },
    });

    expect(prisma.transaction.findUnique).toHaveBeenCalledWith({
      where: { id: 1 },
      select: { userId: true },
    });

    expect(createOrderNoticeForUser).toHaveBeenCalledWith({
      userId: 123,
      orderId: 1,
      type: "shipped",
    });

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Shipping state updated",
      shipping: { State: "SHIPPING" },
    });
  });

  it("should handle COMPLETE state and set notice type to arrived", async () => {
    const req = mockReq({ id: "2" }, { state: "COMPLETE" });
    const res = mockRes();

    (prisma.shipping.update as jest.Mock).mockResolvedValue({ State: "COMPLETE" });
    (prisma.transaction.findUnique as jest.Mock).mockResolvedValue({ userId: 456 });
    (createOrderNoticeForUser as jest.Mock).mockResolvedValue(undefined);

    await updateShippingState(req, res);

    expect(createOrderNoticeForUser).toHaveBeenCalledWith({
      userId: 456,
      orderId: 2,
      type: "arrived",
    });
  });

  it("should return 500 if prisma update throws error", async () => {
    const req = mockReq({ id: "1" }, { state: "SHIPPING" });
    const res = mockRes();

    (prisma.shipping.update as jest.Mock).mockRejectedValue(new Error("DB error"));

    await updateShippingState(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Error updating shipping state",
      error: expect.any(Error),
    });
  });
});
