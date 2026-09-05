import mongoose, { Document, Schema } from 'mongoose';

export interface ICustomer extends Document {
  user: mongoose.Types.ObjectId;
  loyaltyPoints: number;
  favouriteStudios: mongoose.Types.ObjectId[];
  preferences: {
    preferredCities: string[];
    preferredCategories: string[];
    newsletterSubscribed: boolean;
  };
  totalBookingsCount: number;
  totalOrdersCount: number;
  totalSpent: number;
  createdAt: Date;
  updatedAt: Date;
}

const CustomerSchema = new Schema<ICustomer>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
    loyaltyPoints: { type: Number, default: 100 },
    favouriteStudios: [{ type: Schema.Types.ObjectId, ref: 'Studio' }],
    preferences: {
      preferredCities: [{ type: String }],
      preferredCategories: [{ type: String }],
      newsletterSubscribed: { type: Boolean, default: true },
    },
    totalBookingsCount: { type: Number, default: 0 },
    totalOrdersCount: { type: Number, default: 0 },
    totalSpent: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Customer = mongoose.model<ICustomer>('Customer', CustomerSchema);
