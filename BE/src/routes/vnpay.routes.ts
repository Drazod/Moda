
import express from 'express';
import { createPayment, handleReturn, manualRefund } from '../controllers/vnpay.controller';
import authMiddleware from '../middlewares/authentication';

const router = express.Router();

router.post('/create-payment', authMiddleware, createPayment);
router.get('/payment-return', handleReturn);
router.post('/refund', authMiddleware, manualRefund); // Manual refund endpoint for admin

export default router;
