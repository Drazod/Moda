// src/test/user.controller.test.ts
import { userTransactionHistory, userProfile, userUpdate } from "../controllers/user.controller";
import { prisma } from "../index";

jest.mock("../index", () => ({
  prisma: {
    transaction: {
      findMany: jest.fn(),
    },
    user: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  },
}));

const mockReq = (user?: any, params: any = {}, body: any = {}) =>
  ({ user, params, body } as unknown as import("express").Request);

const mockRes = () => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("User Controller", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("userTransactionHistory", () => {
    it("should return 401 if user not authenticated", async () => {
      const req = mockReq();
      const res = mockRes();

      await userTransactionHistory(req, res);
      expect(res.status).toHaveBeenCalledWith(401);
    });

    it("should return transaction history", async () => {
      const req = mockReq({ id: 1 });
      const res = mockRes();
      const mockTransactions = [
        {
          id: 1,
          createdAt: new Date("2025-09-28T10:00:00Z"),
          amount: 150000,
          transactionDetails: [
            {
              clothes: { name: "Shirt" },
              size: { label: "M" },
              quantity: 1,
            },
          ],
        },
      ];
      (prisma.transaction.findMany as jest.Mock).mockResolvedValue(mockTransactions);

      await userTransactionHistory(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "User transaction history",
          transactions: expect.any(Array),
        })
      );
    });
  });

  describe("userProfile", () => {
    it("should return 401 if user not authenticated", async () => {
      const req = mockReq();
      const res = mockRes();

      await userProfile(req, res);
      expect(res.status).toHaveBeenCalledWith(401);
    });

    it("should return user profile", async () => {
      const req = mockReq({ id: 1 });
      const res = mockRes();
      const mockUser = { id: 1, name: "Alice", email: "alice@example.com" };
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

      await userProfile(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: "User Profile: ", user: mockUser });
    });
  });

  describe("userUpdate", () => {
    it("should return 401 if user not authenticated", async () => {
      const req = mockReq();
      const res = mockRes();

      await userUpdate(req, res);
      expect(res.status).toHaveBeenCalledWith(401);
    });

    it("should update user and return updated user", async () => {
      const req = mockReq({ id: 1 }, {}, { name: "Bob" });
      const res = mockRes();
      const updatedUser = { id: 1, name: "Bob", email: "bob@example.com" };
      (prisma.user.update as jest.Mock).mockResolvedValue(updatedUser);

      await userUpdate(req, res);

      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { name: "Bob" },
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "User updated successfully",
        user: updatedUser,
      });
    });
  });
});
