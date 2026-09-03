"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMyInvoices = exports.getInvoiceById = void 0;
const Invoice_js_1 = require("../models/Invoice.js");
const getInvoiceById = async (req, res) => {
    try {
        const { id } = req.params;
        const invoice = await Invoice_js_1.Invoice.findOne({
            $or: [{ _id: id }, { invoiceNumber: id }, { orderId: id }, { bookingId: id }]
        }).populate('orderId').populate('bookingId');
        if (!invoice) {
            res.status(404).json({ success: false, message: 'Invoice not found' });
            return;
        }
        res.json({
            success: true,
            invoice
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getInvoiceById = getInvoiceById;
const getMyInvoices = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ success: false, message: 'Not authenticated' });
            return;
        }
        const invoices = await Invoice_js_1.Invoice.find({ userId: req.user.id }).sort({ createdAt: -1 });
        res.json({
            success: true,
            invoices
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getMyInvoices = getMyInvoices;
