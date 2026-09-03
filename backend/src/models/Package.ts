import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IPackage extends Document {
  studioId: Types.ObjectId;
  categoryId: Types.ObjectId;
  title: string;
  slug: string;
  description: string;
  price: number;
  discountPrice?: number;
  advancePercentage: number;
  durationHours: number;
  editedPhotosCount: number;
  rawPhotosCount: number;
  deliverables: string[];
  inclusions: string[];
  exclusions: string[];
  isPopular: boolean;
  isActive: boolean;
  bannerImage?: string;
  createdAt: Date;
  updatedAt: Date;
}

const PackageSchema = new Schema<IPackage>(
  {
    studioId: { type: Schema.Types.ObjectId, ref: 'Studio', required: true, index: true },
    categoryId: { type: Schema.Types.ObjectId, ref: 'PhotoshootCategory', required: true, index: true },
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    discountPrice: { type: Number, min: 0 },
    advancePercentage: { type: Number, default: 20, min: 0, max: 100 },
    durationHours: { type: Number, required: true, default: 2 },
    editedPhotosCount: { type: Number, default: 25 },
    rawPhotosCount: { type: Number, default: 200 },
    deliverables: [{ type: String }],
    inclusions: [{ type: String }],
    exclusions: [{ type: String }],
    isPopular: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    bannerImage: { type: String }
  },
  { timestamps: true }
);

export const Package = mongoose.model<IPackage>('Package', PackageSchema);
