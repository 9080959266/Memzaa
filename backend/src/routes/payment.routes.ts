import { Router } from 'express';
import { createPaymentOrder, verifyPayment } from '../controllers/payment.controller.js';
import { authenticateJWT } from '../middleware/auth.js';

const router = Router();

router.post('/create-order', authenticateJWT, createPaymentOrder);
router.post('/verify', authenticateJWT, verifyPayment);

export default router;
