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
exports.Studio = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const PortfolioItemSchema = new mongoose_1.Schema({
    url: { type: String, required: true },
    title: { type: String, default: 'Studio Shot' },
    category: { type: String, default: 'General' },
    featured: { type: Boolean, default: false }
});
const StudioSchema = new mongoose_1.Schema({
    name: { type: String, required: true, trim: true, index: true },
    ownerId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    tagline: { type: String, default: 'Premium Photo & Film Studio' },
    description: { type: String, required: true },
    city: { type: String, required: true, index: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    rating: { type: Number, default: 4.8, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },
    startingPrice: { type: Number, default: 5000 },
    priceRange: { type: String, enum: ['₹', '₹₹', '₹₹₹', '₹₹₹₹'], default: '₹₹' },
    portfolio: [PortfolioItemSchema],
    amenities: [{ type: String }],
    equipment: [{ type: String }],
    operatingHours: {
        open: { type: String, default: '09:00 AM' },
        close: { type: String, default: '09:00 PM' },
        workingDays: { type: [String], default: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] }
    },
    verifiedStatus: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'approved', index: true },
    rejectionReason: { type: String },
    bannerImage: { type: String, default: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1200&q=80' },
    logoImage: { type: String, default: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=300&q=80' },
    featured: { type: Boolean, default: false }
}, { timestamps: true });
exports.Studio = mongoose_1.default.model('Studio', StudioSchema);
