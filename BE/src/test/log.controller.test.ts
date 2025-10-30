// src/test/log.controller.test.ts
import { prisma } from "..";
import { getLogs } from "../controllers/log.controller";
import { Request, Response } from "express";

jest.mock("..", () => ({
  prisma: {
    log: {
      findMany: jest.fn(),
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

describe("Log Controller", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("getLogs: should return logs successfully", async () => {
    const fakeLogs = [
      { id: 1, userId: 1, action: "Test action", createdAt: new Date() },
      { id: 2, userId: 2, action: "Another action", createdAt: new Date() },
    ];
    (prisma.log.findMany as jest.Mock).mockResolvedValue(fakeLogs);

    const req = mockReq();
    const res = mockRes();

    await getLogs(req, res);

    expect(prisma.log.findMany).toHaveBeenCalledWith({ orderBy: { createdAt: "desc" } });
    expect(res.json).toHaveBeenCalledWith(fakeLogs);
  });

  it("getLogs: should handle errors", async () => {
    (prisma.log.findMany as jest.Mock).mockRejectedValue(new Error("DB error"));

    const req = mockReq();
    const res = mockRes();

    await getLogs(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Failed to fetch logs" });
  });
});
