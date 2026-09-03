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
exports.Booking = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const BookingSchema = new mongoose_1.Schema({
    bookingId: { type: String, required: true, unique: true, index: true },
    customerId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    studioId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Studio', required: true, index: true },
    packageId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Package', required: true },
    eventDate: { type: String, required: true, index: true },
    timeSlot: { type: String, required: true },
    venue: {
        address: { type: String, required: true },
        city: { type: String, required: true },
        landmark: { type: String },
        pincode: { type: String },
        venueType: {
            type: String,
            enum: ['studio', 'outdoor', 'customer_home', 'resort_hotel', 'temple_hall'],
            default: 'studio'
        }
    },
    totalAmount: { type: Number, required: true },
    advanceAmount: { type: Number, required: true },
    remainingAmount: { type: Number, required: true },
    paymentStatus: {
        type: String,
        enum: ['pending', 'advance_paid', 'fully_paid', 'refunded'],
        default: 'advance_paid'
    },
    bookingStatus: {
        type: String,
        enum: ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled'],
        default: 'confirmed',
        index: true
    },
    advancePaymentId: { type: String },
    notes: { type: String },
    specialRequests: { type: String },
    cancellationReason: { type: String }
}, { timestamps: true });
exports.Booking = mongoose_1.default.model('Booking', BookingSchema);
