import mongoose, { Document, Schema } from 'mongoose';

export interface IShopOwner extends Document {
  user: mongoose.Types.ObjectId;
  studio: mongoose.Types.ObjectId;
  gstNumber?: string;
  panNumber?: string;
  bankDetails: {
    accountHolderName: string;
    accountNumber: string;
    ifscCode: string;
    bankName: string;
    branchName?: string;
    isVerified: boolean;
  };
  commissionRate: number; // e.g. 10 for 10%
  payoutSchedule: 'weekly' | 'fortnightly' | 'monthly';
  totalEarnings: number;
  pendingPayout: number;
  settledPayout: number;
  verificationStatus: 'pending' | 'verified' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}

const ShopOwnerSchema = new Schema<IShopOwner>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
    studio: { type: Schema.Types.ObjectId, ref: 'Studio', required: true, unique: true, index: true },
    gstNumber: { type: String, trim: true },
    panNumber: { type: String, trim: true },
    bankDetails: {
      accountHolderName: { type: String, default: '' },
      accountNumber: { type: String, default: '' },
      ifscCode: { type: String, default: '' },
      bankName: { type: String, default: 'HDFC Bank' },
      branchName: { type: String, default: '' },
      isVerified: { type: Boolean, default: false },
    },
    commissionRate: { type: Number, default: 10 },
    payoutSchedule: { type: String, enum: ['weekly', 'fortnightly', 'monthly'], default: 'fortnightly' },
    totalEarnings: { type: Number, default: 0 },
    pendingPayout: { type: Number, default: 0 },
    settledPayout: { type: Number, default: 0 },
    verificationStatus: { type: String, enum: ['pending', 'verified', 'rejected'], default: 'verified' },
  },
  { timestamps: true }
);

export const ShopOwner = mongoose.model<IShopOwner>('ShopOwner', ShopOwnerSchema);
