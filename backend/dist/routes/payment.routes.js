"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const payment_controller_js_1 = require("../controllers/payment.controller.js");
const auth_js_1 = require("../middleware/auth.js");
const router = (0, express_1.Router)();
router.post('/create-order', auth_js_1.authenticateJWT, payment_controller_js_1.createPaymentOrder);
router.post('/verify', auth_js_1.authenticateJWT, payment_controller_js_1.verifyPayment);
exports.default = router;
