"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Invoice = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const InvoiceLineItemSchema = new mongoose_1.Schema({
    description: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    unitPrice: { type: Number, required: true },
    taxRate: { type: Number, default: 18 },
    total: { type: Number, required: true }
});
const InvoiceSchema = new mongoose_1.Schema({
    invoiceNumber: { type: String, required: true, unique: true, index: true },
    orderId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Order', index: true },
    bookingId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Booking', index: true },
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    studioId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Studio' },
    customerDetails: {
        name: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String, required: true },
        address: { type: String, required: true },
        city: { type: String, required: true },
        pincode: { type: String, required: true }
    },
    sellerDetails: {
        businessName: { type: String, default: 'MEMORA Experiences Pvt. Ltd.' },
        gstin: { type: String, default: '33AABCM9988C1Z8' },
        pan: { type: String, default: 'AABCM9988C' },
        address: { type: String, default: '45, Cathedral Road, Anna Nagar, Chennai - 600086, India' },
        email: { type: String, default: 'billing@memora.com' },
        phone: { type: String, default: '+91 98400 12345' }
    },
    items: [InvoiceLineItemSchema],
    subtotal: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    taxAmount: { type: Number, default: 0 },
    grandTotal: { type: Number, required: true },
    paymentStatus: { type: String, enum: ['paid', 'pending', 'partially_paid'], default: 'paid' },
    paymentMethod: { type: String, default: 'UPI / Online' },
    paymentRef: { type: String },
    issuedDate: { type: Date, default: Date.now },
    dueDate: { type: Date },
    pdfUrl: { type: String }
}, { timestamps: true });
exports.Invoice = mongoose_1.default.model('Invoice', InvoiceSchema);
