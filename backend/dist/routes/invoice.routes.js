"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const invoice_controller_js_1 = require("../controllers/invoice.controller.js");
const auth_js_1 = require("../middleware/auth.js");
const router = (0, express_1.Router)();
router.get('/my-invoices', auth_js_1.authenticateJWT, invoice_controller_js_1.getMyInvoices);
router.get('/:id', auth_js_1.authenticateJWT, invoice_controller_js_1.getInvoiceById);
exports.default = router;
