import { Request, Response } from 'express';
import { prisma } from '..';
// Nếu dự án của bạn dùng Prisma 5, TransactionClient có sẵn trong namespace Prisma.
// Dùng import type để tránh kéo runtime:
import type { Prisma, PrismaClient } from '@prisma/client';

/* =========================================================
 *  PUBLIC ENDPOINTS
 * =======================================================*/

// Get user's point balance and history
export const getPointsInfo = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { points: true },
    });

    const pointHistory = await prisma.pointHistory.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' },
      take: 50, // Last 50 transactions
    });

    res.status(200).json({
      currentPoints: user?.points ?? 0,
      history: pointHistory,
    });
  } catch (error) {
    console.error('Get points info error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/* =========================================================
 *  POINTS POLICY / HELPERS (tái sử dụng được)
 * =======================================================*/

/** Tỉ lệ tích điểm: 1000 VND = 1 điểm */
export const calculatePointsFromAmount = (amount: number): number => {
  return Math.floor((Number(amount) || 0) / 1000);
};

/** Trần điểm được dùng: 50% của số tiền sau voucher */
export const calcMaxRedeemablePoints = (subtotalAfterVoucher: number): number => {
  const base = Math.max(0, Number(subtotalAfterVoucher) || 0);
  return Math.floor(base * 0.5);
};

/* =========================================================
 *  OUT-OF-TRANSACTION (legacy) — vẫn giữ để tương thích
 *  Khuyến nghị: dùng các bản TX phía dưới cho an toàn dữ liệu.
 * =======================================================*/

// Add points to user (called after successful payment)
export const addPointsFromPayment = async (userId: number, transactionId: number, amount: number) => {
  const pointsToAdd = calculatePointsFromAmount(amount);
  if (pointsToAdd <= 0) return;

  try {
    await prisma.user.update({
      where: { id: userId },
      data: { points: { increment: pointsToAdd } },
    });

    await prisma.pointHistory.create({
      data: {
        userId,
        points: pointsToAdd,
        type: 'EARNED_PAYMENT',
        description: `Earned ${pointsToAdd} points from payment`,
        transactionId,
      },
    });

    console.log(`Added ${pointsToAdd} points to user ${userId} from transaction ${transactionId}`);
  } catch (error) {
    console.error('Error adding points from payment:', error);
  }
};

// Add points from refund (1:1 ratio with refund amount)
export const addPointsFromRefund = async (userId: number, refundId: number, refundAmount: number) => {
  const pointsToAdd = Math.floor(Number(refundAmount) || 0); // 1 VND = 1 point for refunds
  if (pointsToAdd <= 0) return;

  try {
    await prisma.user.update({
      where: { id: userId },
      data: { points: { increment: pointsToAdd } },
    });

    await prisma.pointHistory.create({
      data: {
        userId,
        points: pointsToAdd,
        type: 'RETURNED_REFUND',
        description: `Received ${pointsToAdd} points from refund`,
        refundId,
      },
    });

    console.log(`Added ${pointsToAdd} points to user ${userId} from refund ${refundId}`);
  } catch (error) {
    console.error('Error adding points from refund:', error);
  }
};

/* =========================================================
 *  TRANSACTION-SAFE HELPERS (Khuyến nghị dùng)
 *  Dùng các hàm dưới đây bên trong prisma.$transaction(async (tx) => {...})
 * =======================================================*/

/** Trừ điểm khi mua hàng trong cùng transaction + ghi history */
export const spendPointsTx = async (
  tx: Prisma.TransactionClient | PrismaClient,
  params: { userId: number; transactionId: number; pointsToUse: number }
) => {
  const { userId, transactionId, pointsToUse } = params;
  const amount = Math.max(0, Math.floor(pointsToUse));
  if (amount <= 0) return;

  // Chỉ trừ khi đủ điểm (tránh race condition)
  const upd = await (tx as any).user.updateMany({
    where: { id: userId, points: { gte: amount } },
    data: { points: { decrement: amount } },
  });
  if (upd.count === 0) {
    throw new Error('Not enough points');
  }

  await (tx as any).pointHistory.create({
    data: {
      userId,
      points: -amount,
      type: 'SPENT_PURCHASE',
      description: `Used ${amount} points for purchase (txn #${transactionId})`,
      transactionId,
    },
  });
};

/** Cộng điểm thưởng theo số tiền thực trả trong cùng transaction + ghi history */
export const addPointsFromPaymentTx = async (
  tx: Prisma.TransactionClient | PrismaClient,
  params: { userId: number; transactionId: number; amountPaid: number }
) => {
  const { userId, transactionId, amountPaid } = params;
  const pointsToAdd = calculatePointsFromAmount(amountPaid);
  if (pointsToAdd <= 0) return;

  await (tx as any).user.update({
    where: { id: userId },
    data: { points: { increment: pointsToAdd } },
  });

  await (tx as any).pointHistory.create({
    data: {
      userId,
      points: pointsToAdd,
      type: 'EARNED_PAYMENT',
      description: `Earned ${pointsToAdd} points from payment (txn #${transactionId})`,
      transactionId,
    },
  });
};

/** Cộng điểm khi refund trong cùng transaction + ghi history (1:1) */
export const addPointsFromRefundTx = async (
  tx: Prisma.TransactionClient | PrismaClient,
  params: { userId: number; refundId: number; refundAmount: number }
) => {
  const { userId, refundId, refundAmount } = params;
  const pointsToAdd = Math.floor(Number(refundAmount) || 0);
  if (pointsToAdd <= 0) return;

  await (tx as any).user.update({
    where: { id: userId },
    data: { points: { increment: pointsToAdd } },
  });

  await (tx as any).pointHistory.create({
    data: {
      userId,
      points: pointsToAdd,
      type: 'RETURNED_REFUND',
      description: `Received ${pointsToAdd} points from refund`,
      refundId,
    },
  });
};
