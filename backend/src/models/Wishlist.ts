import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IWishlist extends Document {
  userId: Types.ObjectId;
  studios: Types.ObjectId[];
  products: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const WishlistSchema = new Schema<IWishlist>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
    studios: [{ type: Schema.Types.ObjectId, ref: 'Studio' }],
    products: [{ type: Schema.Types.ObjectId, ref: 'Product' }]
  },
  { timestamps: true }
);

export const Wishlist = mongoose.model<IWishlist>('Wishlist', WishlistSchema);
