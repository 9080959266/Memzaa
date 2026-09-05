import mongoose, { Document, Schema } from 'mongoose';

export interface IPhotoshootCategory extends Document {
  name: string;
  slug: string;
  description: string;
  image: string;
  icon: string;
  banner: string;
  featured: boolean;
  isActive: boolean;
  order: number;
}

const PhotoshootCategorySchema = new Schema<IPhotoshootCategory>(
  {
    name: { type: String, required: true, unique: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    icon: { type: String, default: 'camera' },
    banner: { type: String, default: '' },
    featured: { type: Boolean, default: true },
    isActive: { type: Boolean, default: true, index: true },
    order: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export const PhotoshootCategory = mongoose.model<IPhotoshootCategory>('PhotoshootCategory', PhotoshootCategorySchema);
