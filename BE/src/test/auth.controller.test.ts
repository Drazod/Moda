import { Register, verifyOtp, Login, changePassword, changeIdentity, someFunction } from "../controllers/auth.controller";
import { prisma } from "..";
import jwt from "jsonwebtoken";
import { hashSync, compareSync } from "bcryptjs";

// Mock dependencies
jest.mock("..", () => ({
  prisma: {
    user: {
      findFirst: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
  },
}));

jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(),
}));

jest.mock("bcryptjs", () => ({
  hashSync: jest.fn((p) => `hashed-${p}`),
  compareSync: jest.fn(),
}));

jest.mock("../utils/email", () => ({
  sendOtpEmail: jest.fn(),
}));

const mockReq = (body: any = {}, params: any = {}, user: any = null) => {
  return { body, params, user } as any;
};
const mockRes = () => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("Auth Controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ---------- Register ----------
  it("Register - missing fields", async () => {
    const req = mockReq({});
    const res = mockRes();
    await Register(req, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("Register - short password", async () => {
    const req = mockReq({ email: "a@a.com", password: "123", name: "A" });
    const res = mockRes();
    await Register(req, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("Register - user already exists", async () => {
    (prisma.user.findFirst as jest.Mock).mockResolvedValue({ id: 1 });
    const req = mockReq({ email: "a@a.com", password: "123456", name: "A" });
    const res = mockRes();
    await Register(req, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("Register - success", async () => {
    (prisma.user.findFirst as jest.Mock).mockResolvedValue(null);
    (prisma.user.create as jest.Mock).mockResolvedValue({ id: 1, email: "a@a.com" });
    const req = mockReq({ email: "a@a.com", password: "123456", name: "A" });
    const res = mockRes();
    await Register(req, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(201);
  });

  // ---------- Verify OTP ----------
  it("VerifyOtp - missing fields", async () => {
    const req = mockReq({});
    const res = mockRes();
    await verifyOtp(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("VerifyOtp - user not found", async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
    const req = mockReq({ email: "a@a.com", otp: "123456" });
    const res = mockRes();
    await verifyOtp(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("VerifyOtp - already verified", async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue({ isVerified: true });
    const req = mockReq({ email: "a@a.com", otp: "123456" });
    const res = mockRes();
    await verifyOtp(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("VerifyOtp - invalid otp", async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue({ otpCode: "111111", otpExpiry: new Date(Date.now() + 1000), isVerified: false });
    const req = mockReq({ email: "a@a.com", otp: "222222" });
    const res = mockRes();
    await verifyOtp(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("VerifyOtp - expired otp", async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue({ otpCode: "111111", otpExpiry: new Date(Date.now() - 1000), isVerified: false });
    const req = mockReq({ email: "a@a.com", otp: "111111" });
    const res = mockRes();
    await verifyOtp(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("VerifyOtp - success", async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue({ otpCode: "111111", otpExpiry: new Date(Date.now() + 1000), isVerified: false });
    (prisma.user.update as jest.Mock).mockResolvedValue({ id: 1, email: "a@a.com" });
    (jwt.sign as jest.Mock).mockReturnValue("token123");
    const req = mockReq({ email: "a@a.com", otp: "111111" });
    const res = mockRes();
    await verifyOtp(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  // ---------- Login ----------
  it("Login - user not found", async () => {
    (prisma.user.findFirst as jest.Mock).mockResolvedValue(null);
    const req = mockReq({ email: "a@a.com", password: "123" });
    const res = mockRes();
    await Login(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("Login - wrong password", async () => {
    (prisma.user.findFirst as jest.Mock).mockResolvedValue({ password: "hashed" });
    (compareSync as jest.Mock).mockReturnValue(false);
    const req = mockReq({ email: "a@a.com", password: "123" });
    const res = mockRes();
    await Login(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("Login - success", async () => {
    (prisma.user.findFirst as jest.Mock).mockResolvedValue({ id: 1, email: "a@a.com", password: "hashed" });
    (compareSync as jest.Mock).mockReturnValue(true);
    (jwt.sign as jest.Mock).mockReturnValue("token123");
    const req = mockReq({ email: "a@a.com", password: "123456" });
    const res = mockRes();
    await Login(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  // ---------- changePassword ----------
  it("changePassword - not authenticated", async () => {
    const req = mockReq({}, {}, null);
    const res = mockRes();
    await changePassword(req, res);
    expect(res.status).toHaveBeenCalledWith(401);
  });

  it("changePassword - weak password", async () => {
    const req = mockReq({ oldPassword: "123", newPassword: "abc" }, {}, { id: 1 });
    const res = mockRes();
    await changePassword(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("changePassword - user not found", async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
    const req = mockReq({ oldPassword: "123456", newPassword: "Strong1A" }, {}, { id: 1 });
    const res = mockRes();
    await changePassword(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("changePassword - wrong old password", async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue({ password: "hashed" });
    (compareSync as jest.Mock).mockReturnValue(false);
    const req = mockReq({ oldPassword: "wrong", newPassword: "Strong1A" }, {}, { id: 1 });
    const res = mockRes();
    await changePassword(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("changePassword - success", async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue({ password: "hashed" });
    (compareSync as jest.Mock).mockReturnValue(true);
    const req = mockReq({ oldPassword: "correct", newPassword: "Strong1A" }, {}, { id: 1 });
    const res = mockRes();
    await changePassword(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  // ---------- changeIdentity ----------
  it("changeIdentity - success", async () => {
    (prisma.user.update as jest.Mock).mockResolvedValue({ id: 1, name: "New" });
    const req = mockReq({ name: "New", phone: "123", address: "HN" }, { id: "1" });
    const res = mockRes();
    await changeIdentity(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  // ---------- someFunction ----------
  it("someFunction - not authenticated", async () => {
    const req = mockReq({}, {}, null);
    const res = mockRes();
    someFunction(req, res);
    expect(res.status).toHaveBeenCalledWith(401);
  });

  it("someFunction - success", async () => {
    const req = mockReq({}, {}, { id: 1, email: "a@a.com" });
    const res = mockRes();
    someFunction(req, res);
    expect(res.json).toHaveBeenCalledWith(req.user);
  });
});
