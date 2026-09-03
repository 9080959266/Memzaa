import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IReview extends Document {
  targetType: 'studio' | 'product';
  targetId: Types.ObjectId;
  userId: Types.ObjectId;
  rating: number;
  title: string;
  comment: string;
  photos: string[];
  isVerifiedPurchase: boolean;
  studioReply?: {
    comment: string;
    repliedAt: Date;
  };
  isApproved: boolean;
  helpfulCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema = new Schema<IReview>(
  {
    targetType: { type: String, enum: ['studio', 'product'], required: true, index: true },
    targetId: { type: Schema.Types.ObjectId, required: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    title: { type: String, required: true, trim: true },
    comment: { type: String, required: true },
    photos: [{ type: String }],
    isVerifiedPurchase: { type: Boolean, default: true },
    studioReply: {
      comment: { type: String },
      repliedAt: { type: Date }
    },
    isApproved: { type: Boolean, default: true, index: true },
    helpfulCount: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export const Review = mongoose.model<IReview>('Review', ReviewSchema);
