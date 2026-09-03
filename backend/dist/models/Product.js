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
exports.Product = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const ProductSchema = new mongoose_1.Schema({
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    category: {
        type: String,
        required: true,
        enum: [
            'Photo Prints',
            'Frames',
            'Albums',
            'Photo Books',
            'Canvas Prints',
            'Calendars',
            'Mugs',
            'Cushions',
            'Keychains',
            'Personalized Gifts'
        ],
        index: true
    },
    description: { type: String, required: true },
    basePrice: { type: Number, required: true, min: 0 },
    discountPrice: { type: Number, min: 0 },
    stock: { type: Number, default: 50, min: 0 },
    images: [{ type: String }],
    thumbnail: { type: String, required: true },
    customizationOptions: {
        allowPhoto: { type: Boolean, default: true },
        allowText: { type: Boolean, default: true },
        allowDate: { type: Boolean, default: true },
        allowName: { type: Boolean, default: true },
        frameColors: [{ type: String }],
        sizes: [{
                name: { type: String },
                priceOffset: { type: Number, default: 0 },
                dimensions: { type: String }
            }],
        materials: [{ type: String }],
        defaultTemplateUrl: { type: String }
    },
    rating: { type: Number, default: 4.8, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },
    isFeatured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    tags: [{ type: String }]
}, { timestamps: true });
exports.Product = mongoose_1.default.model('Product', ProductSchema);
