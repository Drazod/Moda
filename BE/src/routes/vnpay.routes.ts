
import express from 'express';
import { createPayment, handleReturn } from '../controllers/vnpay.controller';
import authMiddleware from '../middlewares/authentication';

const router = express.Router();

router.post('/create-payment', authMiddleware, createPayment);
router.get('/payment-return', handleReturn);

export default router;
