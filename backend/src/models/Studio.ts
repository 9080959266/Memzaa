import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IPortfolioItem {
  _id?: Types.ObjectId;
  url: string;
  title: string;
  category: string;
  featured?: boolean;
}

export interface IStudio extends Document {
  name: string;
  ownerId: Types.ObjectId;
  tagline: string;
  description: string;
  city: string;
  address: string;
  phone: string;
  email: string;
  rating: number;
  reviewCount: number;
  startingPrice: number;
  priceRange: '₹' | '₹₹' | '₹₹₹' | '₹₹₹₹';
  portfolio: IPortfolioItem[];
  amenities: string[];
  equipment: string[];
  operatingHours: {
    open: string;
    close: string;
    workingDays: string[];
  };
  blockedDates?: Date[];
  facilities?: string[];
  verifiedStatus: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
  isActive: boolean;
  bannerImage: string;
  logoImage: string;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const PortfolioItemSchema = new Schema({
  url: { type: String, required: true },
  title: { type: String, default: 'Studio Shot' },
  category: { type: String, default: 'General' },
  featured: { type: Boolean, default: false }
});

const StudioSchema = new Schema<IStudio>(
  {
    name: { type: String, required: true, trim: true, index: true },
    ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
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
    blockedDates: [{ type: Date }],
    facilities: [{ type: String }],
    verifiedStatus: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'approved', index: true },
    rejectionReason: { type: String },
    isActive: { type: Boolean, default: true, index: true },
    bannerImage: { type: String, default: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1200&q=80' },
    logoImage: { type: String, default: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=300&q=80' },
    featured: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export const Studio = mongoose.model<IStudio>('Studio', StudioSchema);
