import express from 'express';
import { createPayment, handleReturn } from '../controllers/vnpay.controller';

const router = express.Router();

router.post('/create-payment', createPayment);
router.get('/payment-return', handleReturn);

export default router;
