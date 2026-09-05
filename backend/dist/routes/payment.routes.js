"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const payment_controller_js_1 = require("../controllers/payment.controller.js");
const auth_js_1 = require("../middleware/auth.js");
const router = (0, express_1.Router)();
// Order creation & Verification
router.post('/order', auth_js_1.authenticateJWT, payment_controller_js_1.createPaymentOrder);
router.post('/create-order', auth_js_1.authenticateJWT, payment_controller_js_1.createPaymentOrder); // alias for backwards compat
router.post('/verify', auth_js_1.authenticateJWT, payment_controller_js_1.verifyPayment);
router.post('/failed', auth_js_1.authenticateJWT, payment_controller_js_1.handlePaymentFailure);
router.post('/refund', auth_js_1.authenticateJWT, payment_controller_js_1.initiateRefund);
router.get('/history', auth_js_1.authenticateJWT, payment_controller_js_1.getPaymentHistory);
// Razorpay Webhook (public endpoint verified cryptographically by signature)
router.post('/webhook', payment_controller_js_1.handleRazorpayWebhook);
exports.default = router;
