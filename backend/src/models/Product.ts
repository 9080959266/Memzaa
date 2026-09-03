import mongoose, { Document, Schema } from 'mongoose';

export type ProductCategory = 
  | 'Photo Prints' 
  | 'Frames' 
  | 'Albums' 
  | 'Photo Books' 
  | 'Canvas Prints' 
  | 'Calendars' 
  | 'Mugs' 
  | 'Cushions' 
  | 'Keychains' 
  | 'Personalized Gifts';

export interface IProduct extends Document {
  title: string;
  slug: string;
  category: ProductCategory;
  description: string;
  basePrice: number;
  discountPrice?: number;
  stock: number;
  images: string[];
  thumbnail: string;
  customizationOptions: {
    allowPhoto: boolean;
    allowText: boolean;
    allowDate: boolean;
    allowName: boolean;
    frameColors?: string[];
    sizes?: Array<{ name: string; priceOffset: number; dimensions?: string }>;
    materials?: string[];
    defaultTemplateUrl?: string;
  };
  rating: number;
  reviewCount: number;
  isFeatured: boolean;
  isActive: boolean;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
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
  },
  { timestamps: true }
);

export const Product = mongoose.model<IProduct>('Product', ProductSchema);
