import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  role: 'customer' | 'shop_owner' | 'admin';
  phone?: string;
  avatar?: string;
  googleId?: string;
  addresses?: Array<{
    id?: string;
    label?: string; // Home, Office, Studio
    fullName: string;
    phone: string;
    street: string;
    city: string;
    state: string;
    pincode: string;
    isDefault: boolean;
  }>;
  isActive: boolean;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const AddressSchema = new Schema({
  label: { type: String, default: 'Home' },
  fullName: { type: String, required: true },
  phone: { type: String, required: true },
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  pincode: { type: String, required: true },
  isDefault: { type: Boolean, default: false }
});

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    password: { type: String, select: false },
    role: { type: String, enum: ['customer', 'shop_owner', 'admin'], default: 'customer', index: true },
    phone: { type: String, trim: true },
    avatar: { type: String, default: '' },
    googleId: { type: String, sparse: true, index: true },
    addresses: [AddressSchema],
    isActive: { type: Boolean, default: true },
    isVerified: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>('User', UserSchema);
