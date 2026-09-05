import mongoose, { Document, Schema } from 'mongoose';

export interface IPhoto extends Document {
  user: mongoose.Types.ObjectId;
  studioId?: mongoose.Types.ObjectId;
  orderId?: mongoose.Types.ObjectId;
  bookingId?: mongoose.Types.ObjectId;
  photoJobId?: mongoose.Types.ObjectId;
  url: string;
  thumbnailUrl?: string;
  publicId?: string;
  name: string;
  size?: number;
  mimeType?: string;
  dimensions?: {
    width: number;
    height: number;
  };
  category: 'uploaded' | 'selected' | 'favourite' | 'used_in_order' | 'rejected' | 'proof' | 'edited' | 'raw';
  isFavourite: boolean;
  downloadCount: number;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const PhotoSchema = new Schema<IPhoto>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    studioId: { type: Schema.Types.ObjectId, ref: 'Studio', index: true },
    orderId: { type: Schema.Types.ObjectId, ref: 'Order', index: true },
    bookingId: { type: Schema.Types.ObjectId, ref: 'Booking', index: true },
    photoJobId: { type: Schema.Types.ObjectId, ref: 'PhotoJob', index: true },
    url: { type: String, required: true },
    thumbnailUrl: { type: String },
    publicId: { type: String },
    name: { type: String, required: true },
    size: { type: Number },
    mimeType: { type: String },
    dimensions: {
      width: { type: Number },
      height: { type: Number },
    },
    category: {
      type: String,
      enum: ['uploaded', 'selected', 'favourite', 'used_in_order', 'rejected', 'proof', 'edited', 'raw'],
      default: 'uploaded',
      index: true,
    },
    isFavourite: { type: Boolean, default: false, index: true },
    downloadCount: { type: Number, default: 0 },
    tags: [{ type: String, trim: true }],
  },
  { timestamps: true }
);

export const Photo = mongoose.model<IPhoto>('Photo', PhotoSchema);
