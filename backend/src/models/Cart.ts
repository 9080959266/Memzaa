import mongoose, { Document, Schema, Types } from 'mongoose';

export interface ICartItemCustomization {
  uploadedPhoto?: string;
  customText?: string;
  customName?: string;
  customDate?: string;
  frameColor?: string;
  size?: string;
  material?: string;
  notes?: string;
  previewMockup?: string;
}

export interface ICartItem {
  _id?: Types.ObjectId;
  productId: Types.ObjectId;
  quantity: number;
  unitPrice: number;
  customization?: ICartItemCustomization;
  itemTotal: number;
}

export interface ICart extends Document {
  userId: Types.ObjectId;
  items: ICartItem[];
  subtotal: number;
  couponCode?: string;
  discount: number;
  deliveryFee: number;
  total: number;
  createdAt: Date;
  updatedAt: Date;
}

const CartItemCustomizationSchema = new Schema({
  uploadedPhoto: { type: String },
  customText: { type: String },
  customName: { type: String },
  customDate: { type: String },
  frameColor: { type: String },
  size: { type: String },
  material: { type: String },
  notes: { type: String },
  previewMockup: { type: String }
});

const CartItemSchema = new Schema({
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true, min: 1, default: 1 },
  unitPrice: { type: Number, required: true, min: 0 },
  customization: CartItemCustomizationSchema,
  itemTotal: { type: Number, required: true, min: 0 }
});

const CartSchema = new Schema<ICart>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
    items: [CartItemSchema],
    subtotal: { type: Number, default: 0 },
    couponCode: { type: String },
    discount: { type: Number, default: 0 },
    deliveryFee: { type: Number, default: 0 },
    total: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export const Cart = mongoose.model<ICart>('Cart', CartSchema);
