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
exports.Order = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const OrderItemSchema = new mongoose_1.Schema({
    productId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Product', required: true },
    title: { type: String, required: true },
    category: { type: String, required: true },
    thumbnail: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true },
    customization: {
        uploadedPhoto: { type: String },
        customText: { type: String },
        customName: { type: String },
        customDate: { type: String },
        frameColor: { type: String },
        size: { type: String },
        material: { type: String },
        notes: { type: String },
        previewMockup: { type: String }
    },
    itemTotal: { type: Number, required: true }
});
const TimelineStepSchema = new mongoose_1.Schema({
    status: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    completed: { type: Boolean, default: false },
    updatedBy: { type: String }
});
const OrderSchema = new mongoose_1.Schema({
    orderId: { type: String, required: true, unique: true, index: true },
    customerId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    items: [OrderItemSchema],
    subtotal: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    couponCode: { type: String },
    tax: { type: Number, default: 0 },
    shippingFee: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'failed', 'refunded'],
        default: 'paid',
        index: true
    },
    paymentMethod: {
        type: String,
        enum: ['razorpay', 'upi', 'card', 'cod'],
        default: 'razorpay'
    },
    transactionId: { type: String },
    shippingAddress: {
        fullName: { type: String, required: true },
        phone: { type: String, required: true },
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        pincode: { type: String, required: true }
    },
    currentStatus: {
        type: String,
        enum: [
            'ORDER_PLACED',
            'PAYMENT_CONFIRMED',
            'PHOTOS_UPLOADED',
            'EDITING',
            'PROOF_READY',
            'CUSTOMER_APPROVED',
            'PRINTING',
            'QUALITY_CHECK',
            'READY',
            'OUT_FOR_DELIVERY',
            'DELIVERED',
            'CANCELLED'
        ],
        default: 'ORDER_PLACED',
        index: true
    },
    timeline: [TimelineStepSchema],
    trackingNumber: { type: String },
    courierName: { type: String, default: 'BlueDart Express' },
    estimatedDelivery: { type: String },
    invoiceId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Invoice' },
    notes: { type: String }
}, { timestamps: true });
exports.Order = mongoose_1.default.model('Order', OrderSchema);
