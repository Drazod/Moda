
import express from 'express';
import { createPayment, handleReturn, handleIPN } from '../controllers/momo.controller';
import authMiddleware from '../middlewares/authentication';

const router = express.Router();

router.post('/create-payment', authMiddleware, createPayment);
router.get('/payment-return', handleReturn); // User redirect callback
router.post('/payment-notify', handleIPN); // MoMo IPN webhook (no auth needed)

export default router;
