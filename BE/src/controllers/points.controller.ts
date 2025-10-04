import { Request, Response } from 'express';
import { prisma } from '..';

// Get user's point balance and history
export const getPointsInfo = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { points: true }
    });

    const pointHistory = await prisma.pointHistory.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' },
      take: 50 // Last 50 transactions
    });

    res.status(200).json({
      currentPoints: user?.points || 0,
      history: pointHistory
    });
  } catch (error) {
    console.error('Get points info error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Calculate points from payment amount (100,000 VND = 100 points)
export const calculatePointsFromAmount = (amount: number): number => {
  return Math.floor(amount / 1000); // 1000 VND = 1 point
};

// Add points to user (called after successful payment)
export const addPointsFromPayment = async (userId: number, transactionId: number, amount: number) => {
  const pointsToAdd = calculatePointsFromAmount(amount);
  
  if (pointsToAdd <= 0) return;

  try {
    // Update user points
    await prisma.user.update({
      where: { id: userId },
      data: { points: { increment: pointsToAdd } }
    });

    // Record point history
    await prisma.pointHistory.create({
      data: {
        userId,
        points: pointsToAdd,
        type: 'EARNED_PAYMENT',
        description: `Earned ${pointsToAdd} points from payment`,
        transactionId
      }
    });

    console.log(`Added ${pointsToAdd} points to user ${userId} from transaction ${transactionId}`);
  } catch (error) {
    console.error('Error adding points from payment:', error);
  }
};

// Add points from refund (1:1 ratio with refund amount)
export const addPointsFromRefund = async (userId: number, refundId: number, refundAmount: number) => {
  const pointsToAdd = Math.floor(refundAmount); // 1 VND = 1 point for refunds
  
  if (pointsToAdd <= 0) return;

  try {
    // Update user points
    await prisma.user.update({
      where: { id: userId },
      data: { points: { increment: pointsToAdd } }
    });

    // Record point history
    await prisma.pointHistory.create({
      data: {
        userId,
        points: pointsToAdd,
        type: 'RETURNED_REFUND',
        description: `Received ${pointsToAdd} points from refund`,
        refundId
      }
    });

    console.log(`Added ${pointsToAdd} points to user ${userId} from refund ${refundId}`);
  } catch (error) {
    console.error('Error adding points from refund:', error);
  }
};