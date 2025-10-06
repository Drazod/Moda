// src/test/notice.controller.test.ts
import { getAdminNotices, getNotices, createNotice, updateNoticeState } from "../controllers/notice.controller";
import { prisma, io } from ".."; // đường dẫn tới file prisma và io của bạn
import { uploadToFirebase } from "../services/upload.services"; // giả sử hàm upload ở đây
import { Request, Response } from "express";

// Mock prisma và io
jest.mock("..", () => ({
  prisma: {
    notice: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    image: { create: jest.fn() },
    log: { create: jest.fn() },
  },
  io: { emit: jest.fn(), to: jest.fn().mockReturnThis() },
}));

// Mock uploadToFirebase
jest.mock("../services/upload.services", () => ({
  uploadToFirebase: jest.fn().mockResolvedValue("https://fakeurl.com/image.jpg"),
}));

// Helper tạo mock req/res
const mockReq = (body = {}, params = {}, user = {}, query = {}) =>
  ({ body, params, user, query } as unknown as Request);

const mockRes = () => {
  const res = {} as Response;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("Notice Controller", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getAdminNotices", () => {
    it("should return admin notices", async () => {
      const fakeNotices = [{ id: 1, title: "Test Notice" }];
      (prisma.notice.findMany as jest.Mock).mockResolvedValue(fakeNotices);

      const req = mockReq();
      const res = mockRes();

      await getAdminNotices(req, res);

      expect(res.json).toHaveBeenCalledWith({ notices: fakeNotices });
    });

    it("should handle errors", async () => {
      (prisma.notice.findMany as jest.Mock).mockRejectedValue(new Error("DB error"));
      const req = mockReq();
      const res = mockRes();

      await getAdminNotices(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ error: "Failed to fetch admin notices" })
      );
    });
  });

  describe("getNotices", () => {
    it("should return filtered notices", async () => {
      const fakeNotices = [{ id: 1, title: "Notice" }];
      (prisma.notice.findMany as jest.Mock).mockResolvedValue(fakeNotices);

      const req = mockReq({}, {}, { id: 10 }, { page: "home" });
      const res = mockRes();

      await getNotices(req, res);

      expect(res.json).toHaveBeenCalledWith(fakeNotices);
    });

    it("should handle errors", async () => {
      (prisma.notice.findMany as jest.Mock).mockRejectedValue(new Error("DB error"));

      const req = mockReq({}, {}, { id: 10 }, { page: "home" });
      const res = mockRes();

      await getNotices(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ error: "Failed to fetch notices" })
      );
    });
  });

  describe("createNotice", () => {
    it("should create a notice with welcome page image", async () => {
      (prisma.image.create as jest.Mock).mockResolvedValue({
        id: 1,
        name: "img.jpg",
        url: "https://fakeurl.com/image.jpg",
      });
      (prisma.notice.create as jest.Mock).mockResolvedValue({
        id: 1,
        title: "Notice",
        userId: 1,
        image: { id: 1 },
      });
      (prisma.log.create as jest.Mock).mockResolvedValue({});

      const req = mockReq(
        { title: "Notice", content: "Content", pages: ["welcome page"], state: true },
        {},
        { id: 1, name: "Admin" },
        {}
      );

      req.files = {
        image: [
          { originalname: "img.jpg", buffer: Buffer.from([]), mimetype: "image/jpeg" },
        ],
      } as any;

      const res = mockRes();

      await createNotice(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: "Notice created successfully" })
      );
    });

    it("should create a notice without welcome page", async () => {
      (prisma.notice.create as jest.Mock).mockResolvedValue({
        id: 2,
        title: "Notice 2",
        userId: 1,
      });
      (prisma.log.create as jest.Mock).mockResolvedValue({});

      const req = mockReq(
        { title: "Notice 2", content: "Content 2", pages: ["home page"], state: true },
        {},
        { id: 1, name: "Admin" },
        {}
      );

      const res = mockRes();

      await createNotice(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: "Notice created successfully" })
      );
    });

    it("should return 400 if required fields missing", async () => {
      const req = mockReq({ content: "Content" });
      const res = mockRes();

      await createNotice(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  describe("updateNoticeState", () => {
    it("should update notice state and emit event", async () => {
      const fakeNotice = { id: 1, title: "Notice", state: true, userId: 1 };
      (prisma.notice.update as jest.Mock).mockResolvedValue(fakeNotice);
      (prisma.log.create as jest.Mock).mockResolvedValue({});

      const req = mockReq({ state: true }, { id: "1" }, { id: 1, name: "Admin" });
      const res = mockRes();

      await updateNoticeState(req, res);

      expect(prisma.notice.update).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(fakeNotice);
    });

    it("should return 500 on error", async () => {
      (prisma.notice.update as jest.Mock).mockRejectedValue(new Error("DB error"));

      const req = mockReq({ state: true }, { id: "1" }, { id: 1, name: "Admin" });
      const res = mockRes();

      await updateNoticeState(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });
});
