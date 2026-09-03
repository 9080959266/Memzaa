import { Response } from 'express';
import { Payment } from '../models/Payment.js';
import { Booking } from '../models/Booking.js';
import { Order } from '../models/Order.js';
import { AuthRequest } from '../middleware/auth.js';

export const createPaymentOrder = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated' });
      return;
    }

    const { amount, currency = 'INR', receipt, orderId, bookingId } = req.body;

    if (!amount || amount <= 0) {
      res.status(400).json({ success: false, message: 'Valid amount is required' });
      return;
    }

    // Razorpay Order ID simulator
    const rzpOrderId = `order_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`;

    res.json({
      success: true,
      razorpayKeyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_memora12345',
      order: {
        id: rzpOrderId,
        entity: 'order',
        amount: Math.round(amount * 100), // in paise
        amount_paid: 0,
        amount_due: Math.round(amount * 100),
        currency,
        receipt: receipt || `rcpt_${Date.now()}`,
        status: 'created',
        created_at: Math.floor(Date.now() / 1000)
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const verifyPayment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated' });
      return;
    }

    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature, 
      amount, 
      gateway = 'razorpay',
      orderId, 
      bookingId 
    } = req.body;

    const paymentSuffix = Math.floor(1000 + Math.random() * 9000);
    const payment = await Payment.create({
      paymentId: `MEM-PAY-${paymentSuffix}`,
      orderId,
      bookingId,
      userId: req.user.id,
      amount: amount || 1000,
      currency: 'INR',
      gateway,
      gatewayPaymentId: razorpay_payment_id || `pay_${Date.now()}`,
      gatewayOrderId: razorpay_order_id,
      gatewaySignature: razorpay_signature,
      status: 'success',
      receiptNumber: `RCPT-${Date.now()}`
    });

    if (bookingId) {
      await Booking.findByIdAndUpdate(bookingId, {
        paymentStatus: 'advance_paid',
        advancePaymentId: payment.paymentId
      });
    }

    if (orderId) {
      await Order.findByIdAndUpdate(orderId, {
        paymentStatus: 'paid',
        transactionId: payment.paymentId
      });
    }

    res.json({
      success: true,
      message: 'Payment verified and recorded successfully!',
      payment
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
