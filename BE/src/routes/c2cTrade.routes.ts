import { Router } from 'express';
import { c2cTradeController } from '../controllers/c2cTrade.controller';
import authenticate from '../middlewares/authentication';
import multer from 'multer';

const upload = multer({
  storage: multer.memoryStorage(),
});

const router = Router();

// All C2C trade routes require authentication
router.use(authenticate);

/**
 * @route POST /api/c2c/trades
 * @desc Create a new trade (buyer initiates purchase)
 * @access Private (authenticated users)
 * @body {
 *   listingId: string,
 *   paymentMethod: 'VNPAY' | 'MOMO' | 'WALLET_TOKENS' | 'BANK_TRANSFER' | 'CASH_ON_DELIVERY' | 'OTHER',
 *   deliveryMethod: 'SHIP' | 'MEETUP' | 'OTHER',
 *   deliveryAddress?: string,
 *   buyerNotes?: string
 * }
 */
router.post('/trades', c2cTradeController.createTrade);

/**
 * @route GET /api/c2c/trades/:tradeId
 * @desc Get trade details
 * @access Private (trade participants)
 */
router.get('/trades/:tradeId', c2cTradeController.getTrade);

/**
 * @route GET /api/c2c/my-trades
 * @desc Get current user's trades
 * @access Private (authenticated users)
 * @query { role?: 'buyer' | 'seller' }
 */
router.get('/my-trades', c2cTradeController.getMyTrades);

/**
 * @route POST /api/c2c/trades/:tradeId/submit-payment
 * @desc Buyer submits payment or payment proof
 * @access Private (buyer only)
 * @body { paymentProof: File (optional) }
 */
router.post('/trades/:tradeId/submit-payment', 
  upload.fields([{ name: 'paymentProof', maxCount: 1 }]), 
  c2cTradeController.submitPayment);

/**
 * @route POST /api/c2c/trades/:tradeId/confirm-payment
 * @desc Seller confirms payment received
 * @access Private (seller only)
 */
router.post('/trades/:tradeId/confirm-payment', c2cTradeController.confirmPayment);

/**
 * @route POST /api/c2c/trades/:tradeId/ship
 * @desc Seller marks item as shipped
 * @access Private (seller only)
 * @body { trackingNumber?: string }
 */
router.post('/trades/:tradeId/ship', c2cTradeController.markShipping);

/**
 * @route POST /api/c2c/trades/:tradeId/confirm-delivery
 * @desc Buyer confirms item delivered
 * @access Private (buyer only)
 */
router.post('/trades/:tradeId/confirm-delivery', c2cTradeController.confirmDelivery);

/**
 * @route POST /api/c2c/trades/:tradeId/complete
 * @desc Complete trade (buyer confirms satisfaction or auto-complete)
 * @access Private (buyer or system)
 */
router.post('/trades/:tradeId/complete', c2cTradeController.completeTrade);

/**
 * @route POST /api/c2c/trades/:tradeId/dispute
 * @desc Open a dispute
 * @access Private (trade participants)
 * @body { reason: string }
 */
router.post('/trades/:tradeId/dispute', c2cTradeController.openDispute);

/**
 * @route POST /api/c2c/trades/:tradeId/cancel
 * @desc Cancel trade (before delivery)
 * @access Private (trade participants)
 * @body { reason: string }
 */
router.post('/trades/:tradeId/cancel', c2cTradeController.cancelTrade);

/**
 * @route POST /api/c2c/trades/:tradeId/messages
 * @desc Send message in trade
 * @access Private (trade participants)
 * @body { message: string, attachment: File (optional) }
 */
router.post('/trades/:tradeId/messages', 
  upload.fields([{ name: 'attachment', maxCount: 1 }]), 
  c2cTradeController.sendMessage);

/**
 * @route GET /api/c2c/trades/:tradeId/messages
 * @desc Get trade messages
 * @access Private (trade participants)
 */
router.get('/trades/:tradeId/messages', c2cTradeController.getMessages);

/**
 * @route POST /api/c2c/trades/:tradeId/review
 * @desc Submit review after trade completion
 * @access Private (trade participants)
 * @body {
 *   revieweeId: number,
 *   rating: number (1-5),
 *   comment: string,
 *   role: 'BUYER' | 'SELLER'
 * }
 */
router.post('/trades/:tradeId/review', c2cTradeController.submitReview);

export default router;
