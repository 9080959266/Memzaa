"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPaymentHistory = exports.handleRazorpayWebhook = exports.initiateRefund = exports.handlePaymentFailure = exports.verifyPayment = exports.createPaymentOrder = void 0;
const Payment_js_1 = require("../models/Payment.js");
const Booking_js_1 = require("../models/Booking.js");
const Order_js_1 = require("../models/Order.js");
const Studio_js_1 = require("../models/Studio.js");
const razorpay_js_1 = require("../config/razorpay.js");
const createPaymentOrder = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ success: false, message: 'Not authenticated' });
            return;
        }
        const { amount, currency = 'INR', receipt, orderId, bookingId } = req.body;
        if (!amount || amount <= 0) {
            res.status(400).json({ success: false, message: 'Valid payment amount is required' });
            return;
        }
        const receiptId = receipt || `rcpt_${Date.now()}`;
        const rzpOrder = await (0, razorpay_js_1.createRazorpayOrder)({
            amount: Number(amount),
            currency,
            receipt: receiptId,
            notes: {
                userId: req.user.id,
                orderId: orderId || '',
                bookingId: bookingId || '',
            },
        });
        res.json({
            success: true,
            razorpayKeyId: razorpay_js_1.keyId,
            order: rzpOrder,
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.createPaymentOrder = createPaymentOrder;
const verifyPayment = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ success: false, message: 'Not authenticated' });
            return;
        }
        const razorpay_order_id = req.body.razorpay_order_id || req.body.razorpayOrderId;
        const razorpay_payment_id = req.body.razorpay_payment_id || req.body.razorpayPaymentId;
        const razorpay_signature = req.body.razorpay_signature || req.body.razorpaySignature;
        const { amount, gateway = 'razorpay', orderId, bookingId, } = req.body;
        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            res.status(400).json({
                success: false,
                message: 'Missing required Razorpay payment identifiers (order_id, payment_id, signature)',
            });
            return;
        }
        // Cryptographic HMAC-SHA256 signature verification
        const isSignatureValid = (0, razorpay_js_1.verifyRazorpaySignature)(razorpay_order_id, razorpay_payment_id, razorpay_signature);
        if (!isSignatureValid) {
            // Record failed transaction in MongoDB
            await Payment_js_1.Payment.create({
                paymentId: `MEM-FAIL-${Date.now()}`,
                orderId: orderId || undefined,
                bookingId: bookingId || undefined,
                userId: req.user.id,
                amount: Number(amount) || 0,
                currency: 'INR',
                gateway,
                gatewayPaymentId: razorpay_payment_id,
                gatewayOrderId: razorpay_order_id,
                gatewaySignature: razorpay_signature,
                status: 'failed',
                receiptNumber: `RCPT-FAIL-${Date.now()}`,
            });
            res.status(400).json({
                success: false,
                message: 'Cryptographic signature verification failed. Payment tampered or invalid.',
            });
            return;
        }
        // Payment Verified Successfully
        const paymentSuffix = Math.floor(1000 + Math.random() * 9000);
        const payment = await Payment_js_1.Payment.create({
            paymentId: `MEM-PAY-${paymentSuffix}`,
            orderId: orderId || undefined,
            bookingId: bookingId || undefined,
            userId: req.user.id,
            amount: Number(amount) || 1000,
            currency: 'INR',
            gateway,
            gatewayPaymentId: razorpay_payment_id,
            gatewayOrderId: razorpay_order_id,
            gatewaySignature: razorpay_signature,
            status: 'success',
            receiptNumber: `RCPT-${Date.now()}`,
        });
        if (bookingId) {
            await Booking_js_1.Booking.findByIdAndUpdate(bookingId, {
                paymentStatus: 'advance_paid',
                bookingStatus: 'confirmed',
                advancePaymentId: payment.paymentId,
            });
        }
        if (orderId) {
            await Order_js_1.Order.findByIdAndUpdate(orderId, {
                paymentStatus: 'paid',
                currentStatus: 'PAYMENT_CONFIRMED',
                transactionId: payment.paymentId,
            });
        }
        res.json({
            success: true,
            message: 'Razorpay payment verified and transaction recorded successfully!',
            payment,
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.verifyPayment = verifyPayment;
const handlePaymentFailure = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ success: false, message: 'Not authenticated' });
            return;
        }
        const { razorpay_order_id, amount, errorCode, errorDescription, orderId, bookingId, } = req.body;
        const failedPayment = await Payment_js_1.Payment.create({
            paymentId: `MEM-FAIL-${Date.now()}`,
            orderId: orderId || undefined,
            bookingId: bookingId || undefined,
            userId: req.user.id,
            amount: Number(amount) || 0,
            currency: 'INR',
            gateway: 'razorpay',
            gatewayOrderId: razorpay_order_id,
            status: 'failed',
            receiptNumber: `FAIL-${errorCode || 'ERR'}-${Date.now()}`,
        });
        res.json({
            success: true,
            message: 'Failed payment logged.',
            payment: failedPayment,
            reason: errorDescription || 'Payment was declined by issuing bank or user cancelled',
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.handlePaymentFailure = handlePaymentFailure;
const initiateRefund = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ success: false, message: 'Not authenticated' });
            return;
        }
        const { paymentId, reason, amount } = req.body;
        const payment = await Payment_js_1.Payment.findOne({ paymentId });
        if (!payment) {
            res.status(404).json({ success: false, message: 'Payment record not found' });
            return;
        }
        payment.status = 'refunded';
        await payment.save();
        if (payment.bookingId) {
            await Booking_js_1.Booking.findByIdAndUpdate(payment.bookingId, {
                paymentStatus: 'refunded',
                bookingStatus: 'cancelled',
            });
        }
        if (payment.orderId) {
            await Order_js_1.Order.findByIdAndUpdate(payment.orderId, {
                paymentStatus: 'refunded',
                currentStatus: 'CANCELLED',
            });
        }
        res.json({
            success: true,
            message: 'Payment refund processed successfully.',
            refund: {
                paymentId: payment.paymentId,
                refundAmount: amount || payment.amount,
                status: 'refunded',
                reason: reason || 'Customer requested cancellation',
                timestamp: new Date().toISOString(),
            },
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.initiateRefund = initiateRefund;
const handleRazorpayWebhook = async (req, res) => {
    try {
        const signature = req.headers['x-razorpay-signature'];
        const bodyString = JSON.stringify(req.body);
        if (signature) {
            const isValid = (0, razorpay_js_1.verifyWebhookSignature)(bodyString, signature);
            if (!isValid) {
                res.status(400).json({ success: false, message: 'Invalid webhook signature' });
                return;
            }
        }
        const event = req.body.event;
        console.log(`🔔 Razorpay Webhook Event Received: ${event}`);
        res.json({
            status: 'ok',
            message: 'Webhook received',
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.handleRazorpayWebhook = handleRazorpayWebhook;
const getPaymentHistory = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ success: false, message: 'Not authenticated' });
            return;
        }
        let query = {};
        if (req.user.role === 'customer') {
            query.userId = req.user.id;
        }
        else if (req.user.role === 'shop_owner') {
            const studio = await Studio_js_1.Studio.findOne({ ownerId: req.user.id });
            if (studio) {
                const studioBookings = await Booking_js_1.Booking.find({ studioId: studio._id }).select('_id');
                const bookingIds = studioBookings.map((b) => b._id);
                query = {
                    $or: [
                        { userId: req.user.id },
                        { bookingId: { $in: bookingIds } },
                    ],
                };
            }
            else {
                query.userId = req.user.id;
            }
        }
        const payments = await Payment_js_1.Payment.find(query)
            .sort({ createdAt: -1 })
            .populate('userId', 'name email phone')
            .populate('bookingId', 'bookingId eventDate venueAddress')
            .populate('orderId', 'orderId totalAmount currentStatus');
        res.json({
            success: true,
            count: payments.length,
            payments,
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getPaymentHistory = getPaymentHistory;
