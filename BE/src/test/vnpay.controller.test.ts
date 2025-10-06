// src/test/vnpay.controller.test.ts
import { Request, Response } from 'express';
import * as VnPayController from '../controllers/vnpay.controller';
import { prisma } from '..';
import * as NoticeController from '../controllers/notice.controller';

// Mock Prisma
jest.mock('..', () => ({
  prisma: {
    cart: { update: jest.fn(), findUnique: jest.fn() },
    transaction: { create: jest.fn() },
    shipping: { create: jest.fn() },
    cartItem: { findMany: jest.fn() },
    size: { update: jest.fn() },
    transactionDetail: { create: jest.fn() },
    coupon: { update: jest.fn() },
  },
}));

// Mock createOrderNoticeForUser
jest.mock('../controllers/notice.controller', () => ({
  ...jest.requireActual('../controllers/notice.controller'),
  createOrderNoticeForUser: jest.fn(async ({ userId, orderId }) => ({
    id: 1,
    userId,
    title: 'Order Completed',
    subtitle: `Order #${orderId}`,
    content: 'Your order has been completed',
  })),
}));

// Mock io global
const mockEmit = jest.fn();
const mockTo = jest.fn(() => ({ emit: mockEmit }));
(global as any).io = { to: mockTo, emit: mockEmit };

// Helpers
const mockReq = (body = {}, query = {}, headers = {}, user = {}) =>
  ({ body, query, headers, user, socket: { remoteAddress: '127.0.0.1' } } as unknown as Request);

const mockRes = () => {
  const res = {} as Response;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.redirect = jest.fn().mockReturnValue(res);
  return res;
};

describe('VnPay Controller', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('createPayment: should generate a payment URL', async () => {
    const req = mockReq({ orderId: 1, amount: 100, orderDescription: 'Test order' }, {}, {}, { id: 1 });
    const res = mockRes();

    await VnPayController.createPayment(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ paymentUrl: expect.stringContaining('https://sandbox.vnpayment.vn/paymentv2/vpcpay.html') })
    );
  });

  it('handleReturn: should process payment successfully if cart exists', async () => {
    (prisma.cart.findUnique as jest.Mock).mockResolvedValue({ id: 1, userId: 1, address: 'addr', couponCode: null, user: { address: 'addr' } });
    (prisma.transaction.create as jest.Mock).mockResolvedValue({ id: 1 });
    (prisma.shipping.create as jest.Mock).mockResolvedValue({});
    (prisma.cartItem.findMany as jest.Mock).mockResolvedValue([{ id: 1, ClothesId: 1, sizeId: 1, quantity: 1, totalprice: 100 }]);
    (prisma.size.update as jest.Mock).mockResolvedValue({});
    (prisma.transactionDetail.create as jest.Mock).mockResolvedValue({});
    (prisma.cart.update as jest.Mock).mockResolvedValue({});
    (prisma.coupon.update as jest.Mock).mockResolvedValue({});

    const req = mockReq({}, { vnp_TxnRef: '1', vnp_Amount: '100', vnp_ResponseCode: '00', vnp_SecureHash: 'dummyhash' });
    const res = mockRes();

    // Mock crypto signature
    jest.spyOn(require('crypto'), 'createHmac').mockReturnValue({
      update: jest.fn().mockReturnThis(),
      digest: jest.fn().mockReturnValue('dummyhash'),
    } as any);

    await VnPayController.handleReturn(req, res);

    expect(res.redirect).toHaveBeenCalledWith(expect.stringContaining('payment-success'));
    expect(mockEmit).toHaveBeenCalledWith('new-notice', expect.objectContaining({ userId: 1 }));
    expect(mockTo).toHaveBeenCalledWith('1');
  });

  it('handleReturn: should redirect to failure page if payment failed', async () => {
    const req = mockReq({}, { vnp_TxnRef: '1', vnp_Amount: '100', vnp_ResponseCode: '01', vnp_SecureHash: 'dummyhash' });
    const res = mockRes();

    jest.spyOn(require('crypto'), 'createHmac').mockReturnValue({
      update: jest.fn().mockReturnThis(),
      digest: jest.fn().mockReturnValue('dummyhash'),
    } as any);

    await VnPayController.handleReturn(req, res);
    expect(res.redirect).toHaveBeenCalledWith(expect.stringContaining('payment-failed'));
  });

  it('handleReturn: should redirect to error page if signature invalid', async () => {
    const req = mockReq({}, { vnp_TxnRef: '1', vnp_Amount: '100', vnp_ResponseCode: '00', vnp_SecureHash: 'invalidhash' });
    const res = mockRes();

    jest.spyOn(require('crypto'), 'createHmac').mockReturnValue({
      update: jest.fn().mockReturnThis(),
      digest: jest.fn().mockReturnValue('dummyhash'),
    } as any);

    await VnPayController.handleReturn(req, res);
    expect(res.redirect).toHaveBeenCalledWith(expect.stringContaining('payment-error'));
  });
});
