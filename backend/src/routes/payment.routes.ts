import { Router } from 'express';
import {
  createPaymentOrder,
  verifyPayment,
  handlePaymentFailure,
  initiateRefund,
  handleRazorpayWebhook,
  getPaymentHistory,
} from '../controllers/payment.controller.js';
import { authenticateJWT } from '../middleware/auth.js';

const router = Router();

// Order creation & Verification
router.post('/order', authenticateJWT, createPaymentOrder);
router.post('/create-order', authenticateJWT, createPaymentOrder); // alias for backwards compat
router.post('/verify', authenticateJWT, verifyPayment);
router.post('/failed', authenticateJWT, handlePaymentFailure);
router.post('/refund', authenticateJWT, initiateRefund);
router.get('/history', authenticateJWT, getPaymentHistory);

// Razorpay Webhook (public endpoint verified cryptographically by signature)
router.post('/webhook', handleRazorpayWebhook);

export default router;
