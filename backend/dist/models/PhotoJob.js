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
exports.PhotoJob = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const PhotoItemSchema = new mongoose_1.Schema({
    url: { type: String, required: true },
    originalName: { type: String, required: true },
    sizeBytes: { type: Number },
    status: { type: String, enum: ['uploaded', 'selected', 'rejected'], default: 'uploaded' },
    rejectionReason: { type: String },
    comments: { type: String },
    uploadedAt: { type: Date, default: Date.now }
});
const QCChecklistSchema = new mongoose_1.Schema({
    item: { type: String, required: true },
    checked: { type: Boolean, default: false }
});
const PhotoJobSchema = new mongoose_1.Schema({
    jobId: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    orderId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Order', index: true },
    bookingId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Booking', index: true },
    studioId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Studio', required: true, index: true },
    customerId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    stage: {
        type: String,
        enum: [
            'NEW_ORDER',
            'PHOTOS_UPLOADED',
            'EDITING',
            'PROOF_READY',
            'CUSTOMER_APPROVAL',
            'CUSTOMER_APPROVED',
            'PRINTING',
            'QUALITY_CHECK',
            'READY',
            'DELIVERY',
            'COMPLETED'
        ],
        default: 'NEW_ORDER',
        index: true
    },
    priority: { type: String, enum: ['low', 'medium', 'high', 'urgent'], default: 'medium' },
    photos: [PhotoItemSchema],
    proofVersion: { type: Number, default: 1 },
    latestProofUrl: { type: String },
    customerApprovalStatus: {
        type: String,
        enum: ['pending', 'approved', 'changes_requested'],
        default: 'pending'
    },
    qcChecklist: {
        type: [QCChecklistSchema],
        default: [
            { item: 'Color grading & skin tone natural check', checked: true },
            { item: 'Resolution 300 DPI verified', checked: true },
            { item: 'No cropping / bleed margins cut off', checked: false },
            { item: 'Physical print / frame defect check', checked: false },
            { item: 'Secure packaging & invoice attached', checked: false }
        ]
    },
    dueDate: { type: String },
    assignedEditor: { type: String, default: 'Lead Colorist' },
    notes: { type: String }
}, { timestamps: true });
exports.PhotoJob = mongoose_1.default.model('PhotoJob', PhotoJobSchema);
