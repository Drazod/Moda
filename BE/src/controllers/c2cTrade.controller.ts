import { Request, Response } from 'express';
import { c2cTradeService } from '../services/c2cTrade.services';
import { PaymentMethod, DeliveryMethod, ReviewRole } from '@prisma/client';
import { uploadToFirebase } from '../services/upload.services';
import { prisma } from '..';

export const c2cTradeController = {
  /**
   * POST /api/c2c/trades
   * Create a new trade (buyer initiates purchase)
   */
  async createTrade(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const {
        listingId,
        paymentMethod,
        deliveryMethod,
        deliveryAddress,
        buyerNotes
      } = req.body;

      // Validation
      if (!listingId || !paymentMethod || !deliveryMethod) {
        return res.status(400).json({
          message: 'Missing required fields: listingId, paymentMethod, deliveryMethod'
        });
      }

      if (!Object.values(PaymentMethod).includes(paymentMethod)) {
        return res.status(400).json({
          message: `Invalid paymentMethod. Must be one of: ${Object.values(PaymentMethod).join(', ')}`
        });
      }

      if (!Object.values(DeliveryMethod).includes(deliveryMethod)) {
        return res.status(400).json({
          message: `Invalid deliveryMethod. Must be one of: ${Object.values(DeliveryMethod).join(', ')}`
        });
      }

      const trade = await c2cTradeService.createTrade({
        buyerId: userId,
        listingId,
        paymentMethod,
        deliveryMethod,
        deliveryAddress,
        buyerNotes
      });

      return res.status(201).json({
        message: 'Trade initiated successfully',
        data: trade
      });
    } catch (error: any) {
      console.error('Create trade error:', error);
      return res.status(400).json({
        message: error.message || 'Failed to create trade'
      });
    }
  },

  /**
   * POST /api/c2c/trades/:tradeId/submit-payment
   * Buyer submits payment (or payment proof)
   */
  async submitPayment(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const { tradeId } = req.params;

      // Handle payment proof image upload
      const files = req.files as {
        paymentProof?: Express.Multer.File[];
      };

      let paymentProofUrl: string | undefined;

      if (files && files.paymentProof && files.paymentProof.length > 0) {
        const imageFile = files.paymentProof[0];
        const imageName = Date.now() + "_" + imageFile.originalname;
        paymentProofUrl = await uploadToFirebase({ ...imageFile, originalname: imageName });
      }

      const trade = await c2cTradeService.submitPayment(
        tradeId,
        userId,
        paymentProofUrl
      );

      return res.json({
        message: 'Payment submitted successfully',
        data: trade
      });
    } catch (error: any) {
      console.error('Submit payment error:', error);
      return res.status(400).json({
        message: error.message || 'Failed to submit payment'
      });
    }
  },

  /**
   * POST /api/c2c/trades/:tradeId/confirm-payment
   * Seller confirms payment received
   */
  async confirmPayment(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const { tradeId } = req.params;

      const trade = await c2cTradeService.confirmPayment(tradeId, userId);

      return res.json({
        message: 'Payment confirmed successfully',
        data: trade
      });
    } catch (error: any) {
      console.error('Confirm payment error:', error);
      return res.status(400).json({
        message: error.message || 'Failed to confirm payment'
      });
    }
  },

  /**
   * POST /api/c2c/trades/:tradeId/ship
   * Seller marks item as shipped
   */
  async markShipping(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const { tradeId } = req.params;
      const { trackingNumber } = req.body;

      const trade = await c2cTradeService.markShipping(
        tradeId,
        userId,
        trackingNumber
      );

      return res.json({
        message: 'Item marked as shipped',
        data: trade
      });
    } catch (error: any) {
      console.error('Mark shipping error:', error);
      return res.status(400).json({
        message: error.message || 'Failed to mark as shipped'
      });
    }
  },

  /**
   * POST /api/c2c/trades/:tradeId/confirm-delivery
   * Buyer confirms item delivered
   */
  async confirmDelivery(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const { tradeId } = req.params;

      const trade = await c2cTradeService.confirmDelivery(tradeId, userId);

      return res.json({
        message: 'Delivery confirmed. You have 7 days to open a dispute if there are issues.',
        data: trade
      });
    } catch (error: any) {
      console.error('Confirm delivery error:', error);
      return res.status(400).json({
        message: error.message || 'Failed to confirm delivery'
      });
    }
  },

  /**
   * POST /api/c2c/trades/:tradeId/complete
   * Complete trade (buyer confirms satisfaction or auto-complete)
   */
  async completeTrade(req: Request, res: Response) {
    try {
      const { tradeId } = req.params;

      const trade = await c2cTradeService.completeTrade(tradeId);

      return res.json({
        message: 'Trade completed successfully',
        data: trade
      });
    } catch (error: any) {
      console.error('Complete trade error:', error);
      return res.status(400).json({
        message: error.message || 'Failed to complete trade'
      });
    }
  },

  /**
   * POST /api/c2c/trades/:tradeId/dispute
   * Open a dispute
   */
  async openDispute(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const { tradeId } = req.params;
      const { reason } = req.body;

      if (!reason || reason.trim().length === 0) {
        return res.status(400).json({
          message: 'Dispute reason is required'
        });
      }

      const trade = await c2cTradeService.openDispute(tradeId, userId, reason);

      return res.json({
        message: 'Dispute opened successfully. Admin will review.',
        data: trade
      });
    } catch (error: any) {
      console.error('Open dispute error:', error);
      return res.status(400).json({
        message: error.message || 'Failed to open dispute'
      });
    }
  },

  /**
   * POST /api/c2c/trades/:tradeId/cancel
   * Cancel trade (before delivery)
   */
  async cancelTrade(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const { tradeId } = req.params;
      const { reason } = req.body;

      if (!reason || reason.trim().length === 0) {
        return res.status(400).json({
          message: 'Cancellation reason is required'
        });
      }

      const trade = await c2cTradeService.cancelTrade(tradeId, userId, reason);

      return res.json({
        message: 'Trade cancelled successfully',
        data: trade
      });
    } catch (error: any) {
      console.error('Cancel trade error:', error);
      return res.status(400).json({
        message: error.message || 'Failed to cancel trade'
      });
    }
  },

  /**
   * POST /api/c2c/trades/:tradeId/messages
   * Send message in trade
   */
  async sendMessage(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const { tradeId } = req.params;
      const { message } = req.body;

      if (!message || message.trim().length === 0) {
        return res.status(400).json({
          message: 'Message cannot be empty'
        });
      }

      // Handle attachment upload
      const files = req.files as {
        attachment?: Express.Multer.File[];
      };

      let attachmentUrl: string | undefined;

      if (files && files.attachment && files.attachment.length > 0) {
        const attachmentFile = files.attachment[0];
        const attachmentName = Date.now() + "_" + attachmentFile.originalname;
        attachmentUrl = await uploadToFirebase({ ...attachmentFile, originalname: attachmentName });
      }

      const newMessage = await c2cTradeService.sendMessage(
        tradeId,
        userId,
        message,
        attachmentUrl
      );

      return res.status(201).json({
        message: 'Message sent successfully',
        data: newMessage
      });
    } catch (error: any) {
      console.error('Send message error:', error);
      return res.status(400).json({
        message: error.message || 'Failed to send message'
      });
    }
  },

  /**
   * GET /api/c2c/trades/:tradeId/messages
   * Get trade messages
   */
  async getMessages(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const { tradeId } = req.params;

      const messages = await c2cTradeService.getMessages(tradeId, userId);

      return res.json({
        message: 'Messages retrieved successfully',
        data: messages
      });
    } catch (error: any) {
      console.error('Get messages error:', error);
      return res.status(400).json({
        message: error.message || 'Failed to retrieve messages'
      });
    }
  },

  /**
   * POST /api/c2c/trades/:tradeId/review
   * Submit review after trade completion
   */
  async submitReview(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const { tradeId } = req.params;
      const { revieweeId, rating, comment, role } = req.body;

      // Validation
      if (!revieweeId || !rating || !comment || !role) {
        return res.status(400).json({
          message: 'Missing required fields: revieweeId, rating, comment, role'
        });
      }

      if (!Object.values(ReviewRole).includes(role)) {
        return res.status(400).json({
          message: `Invalid role. Must be one of: ${Object.values(ReviewRole).join(', ')}`
        });
      }

      const review = await c2cTradeService.submitReview({
        tradeId,
        reviewerId: userId,
        revieweeId: Number(revieweeId),
        rating: Number(rating),
        comment,
        role
      });

      return res.status(201).json({
        message: 'Review submitted successfully',
        data: review
      });
    } catch (error: any) {
      console.error('Submit review error:', error);
      return res.status(400).json({
        message: error.message || 'Failed to submit review'
      });
    }
  },

  /**
   * GET /api/c2c/my-trades
   * Get current user's trades
   */
  async getMyTrades(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const { role } = req.query;

      const trades = await c2cTradeService.getUserTrades(
        userId,
        role as 'buyer' | 'seller' | undefined
      );

      return res.json({
        message: 'Trades retrieved successfully',
        data: trades
      });
    } catch (error: any) {
      console.error('Get my trades error:', error);
      return res.status(400).json({
        message: error.message || 'Failed to retrieve trades'
      });
    }
  },

  /**
   * GET /api/c2c/trades/:tradeId
   * Get trade details
   */
  async getTrade(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const { tradeId } = req.params;

      // Get trade with full details
      const trade = await c2cTradeService.getUserTrades(userId);
      const targetTrade = trade.find(t => t.id === tradeId);

      if (!targetTrade) {
        return res.status(404).json({ message: 'Trade not found' });
      }

      return res.json({
        message: 'Trade retrieved successfully',
        data: targetTrade
      });
    } catch (error: any) {
      console.error('Get trade error:', error);
      return res.status(400).json({
        message: error.message || 'Failed to retrieve trade'
      });
    }
  }
};
