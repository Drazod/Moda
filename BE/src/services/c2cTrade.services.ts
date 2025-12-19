import { PrismaClient, C2CTradeStatus, PaymentMethod, DeliveryMethod, ListingStatus, TradeMessageType, ReviewRole } from '@prisma/client';
import { addToInventory } from './inventory.services';
// Note: Wallet/Token system not implemented - WALLET_TOKENS payment method will return error

const prisma = new PrismaClient();

export const c2cTradeService = {
  /**
   * Create a new trade (buyer initiates)
   */
  async createTrade(data: {
    buyerId: number;
    listingId: string;
    paymentMethod: PaymentMethod;
    deliveryMethod: DeliveryMethod;
    deliveryAddress?: string;
    buyerNotes?: string;
  }) {
    // Validate listing exists and is available
    const listing = await prisma.c2CListing.findUnique({
      where: { id: data.listingId },
      include: { seller: true }
    });

    if (!listing) {
      throw new Error('Listing not found');
    }

    if (listing.status !== ListingStatus.ACTIVE) {
      throw new Error('Listing is not available for purchase');
    }

    if (listing.sellerId === data.buyerId) {
      throw new Error('Cannot buy your own listing');
    }

    // Create trade and reserve listing
    const trade = await prisma.$transaction(async (tx) => {
      // Reserve the listing
      await tx.c2CListing.update({
        where: { id: data.listingId },
        data: { status: ListingStatus.RESERVED }
      });

      // Create trade record
      const newTrade = await tx.c2CTrade.create({
        data: {
          buyerId: data.buyerId,
          sellerId: listing.sellerId,
          listingId: data.listingId,
          agreedPrice: listing.price,
          paymentMethod: data.paymentMethod,
          deliveryMethod: data.deliveryMethod,
          deliveryAddress: data.deliveryAddress,
          status: C2CTradeStatus.INITIATED
        },
        include: {
          buyer: { select: { id: true, email: true } },
          seller: { select: { id: true, email: true } },
          listing: {
            include: {
              clothes: true,
              size: true,
              images: { orderBy: { order: 'asc' }, take: 1 }
            }
          }
        }
      });

      // Add system message
      await tx.c2CTradeMessage.create({
        data: {
          tradeId: newTrade.id,
          senderId: data.buyerId,
          type: TradeMessageType.SYSTEM,
          content: 'Trade initiated. Waiting for payment.'
        }
      });

      return newTrade;
    });

    return trade;
  },

  /**
   * Buyer submits payment proof
   */
  async submitPayment(tradeId: string, buyerId: number, paymentProofUrl?: string) {
    const trade = await prisma.c2CTrade.findUnique({
      where: { id: tradeId },
      include: { listing: true }
    });

    if (!trade) {
      throw new Error('Trade not found');
    }

    if (trade.buyerId !== buyerId) {
      throw new Error('Only the buyer can submit payment');
    }

    if (trade.status !== C2CTradeStatus.INITIATED) {
      throw new Error(`Cannot submit payment in status: ${trade.status}`);
    }

    // For WALLET_TOKENS, reject (not implemented)
    if (trade.paymentMethod === PaymentMethod.WALLET_TOKENS) {
      throw new Error('WALLET_TOKENS payment method is not currently available. Please use VNPay, MoMo, or bank transfer.');
    }

    // For other payment methods, wait for seller confirmation
    const updated = await prisma.$transaction(async (tx) => {
      const updatedTrade = await tx.c2CTrade.update({
        where: { id: tradeId },
        data: {
          status: C2CTradeStatus.PAYMENT_PENDING,
          paymentProof: paymentProofUrl
        },
        include: {
          buyer: { select: { id: true, email: true } },
          seller: { select: { id: true, email: true } },
          listing: {
            include: {
              clothes: true,
              size: true,
              images: { orderBy: { order: 'asc' } }
            }
          }
        }
      });

      await tx.c2CTradeMessage.create({
        data: {
          tradeId,
          senderId: buyerId,
          type: paymentProofUrl ? TradeMessageType.PAYMENT_PROOF : TradeMessageType.SYSTEM,
          content: paymentProofUrl
            ? 'Payment proof submitted'
            : 'Payment initiated. Waiting for seller confirmation.'
        }
      });

      return updatedTrade;
    });

    return updated;
  },

  /**
   * Seller confirms payment received
   */
  async confirmPayment(tradeId: string, sellerId: number) {
    const trade = await prisma.c2CTrade.findUnique({
      where: { id: tradeId }
    });

    if (!trade) {
      throw new Error('Trade not found');
    }

    if (trade.sellerId !== sellerId) {
      throw new Error('Only the seller can confirm payment');
    }

    if (trade.status !== C2CTradeStatus.PAYMENT_PENDING) {
      throw new Error(`Cannot confirm payment in status: ${trade.status}`);
    }

    const updated = await prisma.$transaction(async (tx) => {
      const updatedTrade = await tx.c2CTrade.update({
        where: { id: tradeId },
        data: {
          status: C2CTradeStatus.PAYMENT_CONFIRMED,
          paymentConfirmedAt: new Date()
        },
        include: {
          buyer: { select: { id: true, email: true } },
          seller: { select: { id: true, email: true } },
          listing: {
            include: {
              clothes: true,
              size: true
            }
          }
        }
      });

      await tx.c2CTradeMessage.create({
        data: {
          tradeId,
          senderId: sellerId,
          type: TradeMessageType.SYSTEM,
          content: 'Payment confirmed by seller. Ready to ship.'
        }
      });

      return updatedTrade;
    });

    return updated;
  },

  /**
   * Seller marks item as shipped
   */
  async markShipping(tradeId: string, sellerId: number, trackingNumber?: string) {
    const trade = await prisma.c2CTrade.findUnique({
      where: { id: tradeId }
    });

    if (!trade) {
      throw new Error('Trade not found');
    }

    if (trade.sellerId !== sellerId) {
      throw new Error('Only the seller can mark as shipped');
    }

    if (trade.status !== C2CTradeStatus.PAYMENT_CONFIRMED) {
      throw new Error(`Cannot ship in status: ${trade.status}`);
    }

    const updated = await prisma.$transaction(async (tx) => {
      const updatedTrade = await tx.c2CTrade.update({
        where: { id: tradeId },
        data: {
          status: C2CTradeStatus.SHIPPING,
          shippedAt: new Date()
        },
        include: {
          buyer: { select: { id: true, email: true } },
          seller: { select: { id: true, email: true } },
          listing: { include: { clothes: true, size: true } }
        }
      });

      await tx.c2CTradeMessage.create({
        data: {
          tradeId,
          senderId: sellerId,
          type: TradeMessageType.SYSTEM,
          content: trackingNumber
            ? `Item shipped. Tracking: ${trackingNumber}`
            : 'Item shipped.'
        }
      });

      return updatedTrade;
    });

    return updated;
  },

  /**
   * Buyer confirms delivery
   */
  async confirmDelivery(tradeId: string, buyerId: number) {
    const trade = await prisma.c2CTrade.findUnique({
      where: { id: tradeId }
    });

    if (!trade) {
      throw new Error('Trade not found');
    }

    if (trade.buyerId !== buyerId) {
      throw new Error('Only the buyer can confirm delivery');
    }

    if (trade.status !== C2CTradeStatus.SHIPPING) {
      throw new Error(`Cannot confirm delivery in status: ${trade.status}`);
    }

    // Set 7-day dispute window
    const autoCompleteAt = new Date();
    autoCompleteAt.setDate(autoCompleteAt.getDate() + 7);

    const updated = await prisma.$transaction(async (tx) => {
      const updatedTrade = await tx.c2CTrade.update({
        where: { id: tradeId },
        data: {
          status: C2CTradeStatus.DELIVERED,
          deliveredAt: new Date(),
          autoCompleteAt
        },
        include: {
          buyer: { select: { id: true, email: true } },
          seller: { select: { id: true, email: true } },
          listing: { include: { clothes: true, size: true } }
        }
      });

      await tx.c2CTradeMessage.create({
        data: {
          tradeId,
          senderId: buyerId,
          type: TradeMessageType.SYSTEM,
          content: `Delivery confirmed. You have 7 days to open a dispute if there are issues. Trade will auto-complete on ${autoCompleteAt.toLocaleDateString()}.`
        }
      });

      return updatedTrade;
    });

    return updated;
  },

  /**
   * Complete trade (after 7 days or buyer confirms satisfaction)
   */
  async completeTrade(tradeId: string) {
    const trade = await prisma.c2CTrade.findUnique({
      where: { id: tradeId },
      include: { listing: true }
    });

    if (!trade) {
      throw new Error('Trade not found');
    }

    if (trade.status !== C2CTradeStatus.DELIVERED) {
      throw new Error(`Cannot complete trade in status: ${trade.status}`);
    }

    const updated = await prisma.$transaction(async (tx) => {
      // Mark trade as completed
      const updatedTrade = await tx.c2CTrade.update({
        where: { id: tradeId },
        data: {
          status: C2CTradeStatus.COMPLETED,
          completedAt: new Date()
        },
        include: {
          buyer: { select: { id: true, email: true } },
          seller: { select: { id: true, email: true } },
          listing: { include: { clothes: true, size: true } }
        }
      });

      // Update inventory: Add to buyer (item was already removed from seller when listing was created)
      if (updatedTrade.listing.size) {
        // Add item to buyer's inventory
        await addToInventory(
          trade.buyerId,
          updatedTrade.listing.clothesId,
          updatedTrade.listing.size.id,
          1,
          'C2C_PURCHASE',
          tradeId
        );
      }

      // Mark listing as SOLD
      await tx.c2CListing.update({
        where: { id: trade.listingId },
        data: { status: ListingStatus.SOLD }
      });

      // Update reputation stats
      await c2cTradeService.updateReputationStats(trade.buyerId, ReviewRole.BUYER);
      await c2cTradeService.updateReputationStats(trade.sellerId, ReviewRole.SELLER);

      await tx.c2CTradeMessage.create({
        data: {
          tradeId,
          senderId: trade.buyerId,
          type: TradeMessageType.SYSTEM,
          content: 'Trade completed successfully! Please leave a review.'
        }
      });

      return updatedTrade;
    });

    return updated;
  },

  /**
   * Open dispute
   */
  async openDispute(tradeId: string, userId: number, reason: string) {
    const trade = await prisma.c2CTrade.findUnique({
      where: { id: tradeId }
    });

    if (!trade) {
      throw new Error('Trade not found');
    }

    if (trade.buyerId !== userId && trade.sellerId !== userId) {
      throw new Error('Only trade participants can open disputes');
    }

    if (trade.status !== C2CTradeStatus.DELIVERED) {
      throw new Error('Disputes can only be opened after delivery');
    }

    // Check if within 7-day window
    if (trade.autoCompleteAt && new Date() > trade.autoCompleteAt) {
      throw new Error('Dispute window has closed');
    }

    const updated = await prisma.$transaction(async (tx) => {
      const updatedTrade = await tx.c2CTrade.update({
        where: { id: tradeId },
        data: {
          status: C2CTradeStatus.DISPUTED,
          disputeReason: reason,
          disputedAt: new Date()
        },
        include: {
          buyer: { select: { id: true, email: true } },
          seller: { select: { id: true, email: true } },
          listing: { include: { clothes: true, size: true } }
        }
      });

      await tx.c2CTradeMessage.create({
        data: {
          tradeId,
          senderId: userId,
          type: TradeMessageType.SYSTEM,
          content: `Dispute opened: ${reason}`
        }
      });

      return updatedTrade;
    });

    return updated;
  },

  /**
   * Cancel trade (before delivery)
   */
  async cancelTrade(tradeId: string, userId: number, reason: string) {
    const trade = await prisma.c2CTrade.findUnique({
      where: { id: tradeId },
      include: { listing: true }
    });

    if (!trade) {
      throw new Error('Trade not found');
    }

    if (trade.buyerId !== userId && trade.sellerId !== userId) {
      throw new Error('Only trade participants can cancel');
    }

    // Can only cancel before DELIVERED
    const nonCancellableStatuses: C2CTradeStatus[] = [C2CTradeStatus.DELIVERED, C2CTradeStatus.COMPLETED, C2CTradeStatus.DISPUTED];
    if (nonCancellableStatuses.includes(trade.status)) {
      throw new Error(`Cannot cancel trade in status: ${trade.status}`);
    }

    const updated = await prisma.$transaction(async (tx) => {
      // Note: If paid with WALLET_TOKENS, refund would go here (not implemented)
      
      // Mark trade as cancelled
      const updatedTrade = await tx.c2CTrade.update({
        where: { id: tradeId },
        data: {
          status: C2CTradeStatus.CANCELLED,
          cancelReason: reason
        },
        include: {
          buyer: { select: { id: true, email: true } },
          seller: { select: { id: true, email: true } },
          listing: { include: { clothes: true, size: true } }
        }
      });

      // Make listing ACTIVE again
      await tx.c2CListing.update({
        where: { id: trade.listingId },
        data: { status: ListingStatus.ACTIVE }
      });

      await tx.c2CTradeMessage.create({
        data: {
          tradeId,
          senderId: userId,
          type: TradeMessageType.SYSTEM,
          content: `Trade cancelled: ${reason}`
        }
      });

      return updatedTrade;
    });

    return updated;
  },

  /**
   * Send message in trade
   */
  async sendMessage(
    tradeId: string,
    senderId: number,
    message: string,
    attachmentUrl?: string
  ) {
    const trade = await prisma.c2CTrade.findUnique({
      where: { id: tradeId }
    });

    if (!trade) {
      throw new Error('Trade not found');
    }

    if (trade.buyerId !== senderId && trade.sellerId !== senderId) {
      throw new Error('Only trade participants can send messages');
    }

    const newMessage = await prisma.c2CTradeMessage.create({
      data: {
        tradeId,
        senderId,
        type: attachmentUrl ? TradeMessageType.DELIVERY_PROOF : TradeMessageType.TEXT,
        content: message
      },
      include: {
        sender: { select: { id: true, email: true } }
      }
    });

    return newMessage;
  },

  /**
   * Get trade messages
   */
  async getMessages(tradeId: string, userId: number) {
    const trade = await prisma.c2CTrade.findUnique({
      where: { id: tradeId }
    });

    if (!trade) {
      throw new Error('Trade not found');
    }

    if (trade.buyerId !== userId && trade.sellerId !== userId) {
      throw new Error('Only trade participants can view messages');
    }

    const messages = await prisma.c2CTradeMessage.findMany({
      where: { tradeId },
      include: {
        sender: { select: { id: true, email: true } }
      },
      orderBy: { createdAt: 'asc' }
    });

    return messages;
  },

  /**
   * Submit review after trade completion
   */
  async submitReview(data: {
    tradeId: string;
    reviewerId: number;
    revieweeId: number;
    rating: number;
    comment: string;
    role: ReviewRole;
  }) {
    const trade = await prisma.c2CTrade.findUnique({
      where: { id: data.tradeId }
    });

    if (!trade) {
      throw new Error('Trade not found');
    }

    if (trade.status !== C2CTradeStatus.COMPLETED) {
      throw new Error('Can only review completed trades');
    }

    if (trade.buyerId !== data.reviewerId && trade.sellerId !== data.reviewerId) {
      throw new Error('Only trade participants can leave reviews');
    }

    // Validate rating
    if (data.rating < 1 || data.rating > 5) {
      throw new Error('Rating must be between 1 and 5');
    }

    const review = await prisma.c2CReview.create({
      data: {
        tradeId: data.tradeId,
        reviewerId: data.reviewerId,
        revieweeId: data.revieweeId,
        rating: data.rating,
        comment: data.comment,
        role: data.role
      },
      include: {
        reviewer: { select: { id: true, email: true } },
        reviewee: { select: { id: true, email: true } }
      }
    });

    // Update reputation stats
    await c2cTradeService.updateReputationStats(data.revieweeId, data.role);

    return review;
  },

  /**
   * Update reputation statistics
   */
  async updateReputationStats(userId: number, role: ReviewRole) {
    const now = new Date();

    // Get or create reputation record
    let reputation = await prisma.c2CReputation.findFirst({
      where: { userId, role }
    });

    if (!reputation) {
      reputation = await prisma.c2CReputation.create({
        data: { userId, role }
      });
    }

    // Calculate stats based on role
    if (role === ReviewRole.SELLER) {
      // Seller stats
      const reviews = await prisma.c2CReview.findMany({
        where: { revieweeId: userId, role: ReviewRole.SELLER }
      });

      const completedTrades = await prisma.c2CTrade.count({
        where: {
          sellerId: userId,
          status: C2CTradeStatus.COMPLETED
        }
      });

      const disputedTrades = await prisma.c2CTrade.count({
        where: {
          sellerId: userId,
          status: C2CTradeStatus.DISPUTED
        }
      });

      const totalTrades = completedTrades + disputedTrades;
      const avgRating = reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0;

      await prisma.c2CReputation.update({
        where: { id: reputation.id },
        data: {
          totalTrades: totalTrades,
          completedTrades: completedTrades,
          disputedTrades: disputedTrades,
          totalRatings: reviews.length,
          averageRating: avgRating,
          completionRate: totalTrades > 0 ? (completedTrades / totalTrades) * 100 : 0,
          disputeRate: totalTrades > 0 ? (disputedTrades / totalTrades) * 100 : 0,
          lastCalculatedAt: now
        }
      });
    } else {
      // Buyer stats
      const reviews = await prisma.c2CReview.findMany({
        where: { revieweeId: userId, role: ReviewRole.BUYER }
      });

      const completedTrades = await prisma.c2CTrade.count({
        where: {
          buyerId: userId,
          status: C2CTradeStatus.COMPLETED
        }
      });

      const avgRating = reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0;

      await prisma.c2CReputation.update({
        where: { id: reputation.id },
        data: {
          totalTrades: completedTrades,
          completedTrades: completedTrades,
          totalRatings: reviews.length,
          averageRating: avgRating,
          lastCalculatedAt: now
        }
      });
    }
  },

  /**
   * Get user's trades
   */
  async getUserTrades(userId: number, role?: 'buyer' | 'seller') {
    const where: any = {};

    if (role === 'buyer') {
      where.buyerId = userId;
    } else if (role === 'seller') {
      where.sellerId = userId;
    } else {
      where.OR = [{ buyerId: userId }, { sellerId: userId }];
    }

    return prisma.c2CTrade.findMany({
      where,
      include: {
        buyer: { select: { id: true, email: true } },
        seller: { select: { id: true, email: true } },
        listing: {
          include: {
            clothes: true,
            size: true,
            images: { orderBy: { order: 'asc' }, take: 1 }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }
};
