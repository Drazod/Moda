import { Request, Response } from 'express';
import { prisma } from '..';

// Request refund for a specific transaction detail item
export const requestRefund = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const { transactionDetailId, quantity, reason } = req.body;

    if (!transactionDetailId || !quantity || quantity <= 0) {
      return res.status(400).json({ message: 'Transaction detail ID and valid quantity are required' });
    }

    // Get the transaction detail and verify ownership
    const transactionDetail = await prisma.transactionDetail.findFirst({
      where: {
        id: transactionDetailId,
        transaction: {
          userId: req.user.id
        }
      },
      include: {
        transaction: {
          include: {
            shipping: true
          }
        },
        clothes: true,
        size: true
      }
    });

    if (!transactionDetail) {
      return res.status(404).json({ message: 'Transaction detail not found or not owned by user' });
    }

    // Check if order is completed (can only refund completed orders)
    const shipping = transactionDetail.transaction.shipping[0];
    if (!shipping || shipping.State !== 'COMPLETE') {
      return res.status(400).json({ message: 'Can only refund items from completed orders' });
    }

    // Check if enough quantity available for refund
    const availableQuantity = transactionDetail.quantity - (transactionDetail.refundedQuantity || 0);
    if (quantity > availableQuantity) {
      return res.status(400).json({ 
        message: `Only ${availableQuantity} items available for refund` 
      });
    }

    // Calculate refund amount (proportional to quantity)
    const unitPrice = transactionDetail.price / transactionDetail.quantity;
    const refundAmount = unitPrice * quantity;
    const pointsReturned = Math.floor(refundAmount); // 1:1 ratio for refunds

    // Create refund request
    const refund = await prisma.refund.create({
      data: {
        userId: req.user.id,
        transactionDetailId,
        quantity,
        refundAmount,
        pointsReturned,
        reason: reason || 'No reason provided',
        status: 'PENDING'
      },
      include: {
        transactionDetail: {
          include: {
            clothes: true,
            size: true
          }
        }
      }
    });

    res.status(201).json({
      message: 'Refund request submitted successfully',
      refund: {
        id: refund.id,
        item: `${refund.transactionDetail.clothes.name} (Size: ${refund.transactionDetail.size.label})`,
        quantity: refund.quantity,
        refundAmount: refund.refundAmount,
        pointsReturned: refund.pointsReturned,
        status: refund.status,
        createdAt: refund.createdAt
      }
    });
  } catch (error) {
    console.error('Request refund error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get user's refund history
export const getRefundHistory = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const refunds = await prisma.refund.findMany({
      where: { userId: req.user.id },
      include: {
        transactionDetail: {
          include: {
            clothes: true,
            size: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    const formattedRefunds = refunds.map(refund => ({
      id: refund.id,
      item: `${refund.transactionDetail.clothes.name} (Size: ${refund.transactionDetail.size.label})`,
      quantity: refund.quantity,
      refundAmount: refund.refundAmount,
      pointsReturned: refund.pointsReturned,
      reason: refund.reason,
      status: refund.status,
      adminNote: refund.adminNote,
      createdAt: refund.createdAt,
      updatedAt: refund.updatedAt
    }));

    res.status(200).json({ refunds: formattedRefunds });
  } catch (error) {
    console.error('Get refund history error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Admin: Get all refund requests
export const getAllRefundRequests = async (req: Request, res: Response) => {
  try {
    if (!req.user || req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const { status } = req.query;
    const whereClause: any = {};
    
    if (status && ['PENDING', 'APPROVED', 'REJECTED', 'COMPLETED'].includes(status as string)) {
      whereClause.status = status;
    }

    const refunds = await prisma.refund.findMany({
      where: whereClause,
      include: {
        user: {
          select: { id: true, name: true, email: true }
        },
        transactionDetail: {
          include: {
            clothes: true,
            size: true,
            transaction: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.status(200).json({ refunds });
  } catch (error) {
    console.error('Get all refund requests error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Admin: Process refund request (approve/reject)
export const processRefundRequest = async (req: Request, res: Response) => {
  try {
    if (!req.user || req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const { refundId } = req.params;
    const { status, adminNote } = req.body;

    if (!['APPROVED', 'REJECTED'].includes(status)) {
      return res.status(400).json({ message: 'Status must be APPROVED or REJECTED' });
    }

    const refund = await prisma.refund.findUnique({
      where: { id: parseInt(refundId) },
      include: {
        user: true,
        transactionDetail: true
      }
    });

    if (!refund) {
      return res.status(404).json({ message: 'Refund request not found' });
    }

    if (refund.status !== 'PENDING') {
      return res.status(400).json({ message: 'Can only process pending refund requests' });
    }

    // Update refund status
    const updatedRefund = await prisma.refund.update({
      where: { id: parseInt(refundId) },
      data: {
        status: status as any,
        adminNote: adminNote || null,
        updatedAt: new Date()
      }
    });

    if (status === 'APPROVED') {
      // Update refunded quantity in transaction detail
      await prisma.transactionDetail.update({
        where: { id: refund.transactionDetailId },
        data: {
          refundedQuantity: {
            increment: refund.quantity
          }
        }
      });

      // Add points to user (1:1 ratio)
      await prisma.user.update({
        where: { id: refund.userId },
        data: {
          points: {
            increment: refund.pointsReturned
          }
        }
      });

      // Create point history record
      await prisma.pointHistory.create({
        data: {
          userId: refund.userId,
          points: refund.pointsReturned,
          type: 'RETURNED_REFUND',
          description: `Refund approved: ${refund.pointsReturned} points returned`,
          refundId: refund.id
        }
      });
    }

    res.status(200).json({
      message: `Refund request ${status.toLowerCase()} successfully`,
      refund: updatedRefund
    });
  } catch (error) {
    console.error('Process refund request error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};