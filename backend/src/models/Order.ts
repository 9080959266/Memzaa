import mongoose, { Document, Schema, Types } from 'mongoose';
import { ICartItemCustomization } from './Cart.js';

export type OrderWorkflowStatus =
  | 'ORDER_PLACED'
  | 'PAYMENT_CONFIRMED'
  | 'PHOTOS_UPLOADED'
  | 'EDITING'
  | 'PROOF_READY'
  | 'CUSTOMER_APPROVED'
  | 'PRINTING'
  | 'QUALITY_CHECK'
  | 'READY'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED';

export interface IOrderItem {
  itemType?: 'product' | 'package';
  productId?: Types.ObjectId;
  packageId?: Types.ObjectId;
  studioId?: Types.ObjectId;
  title: string;
  category: string;
  thumbnail: string;
  quantity: number;
  price: number;
  customization?: ICartItemCustomization;
  itemTotal: number;
}

export interface ITimelineStep {
  status: OrderWorkflowStatus;
  title: string;
  description: string;
  timestamp: Date;
  completed: boolean;
  updatedBy?: string;
}

export interface IOrder extends Document {
  orderId: string; // e.g. MEM-ORD-8821
  customerId: Types.ObjectId;
  items: IOrderItem[];
  subtotal: number;
  discount: number;
  couponCode?: string;
  tax: number;
  shippingFee: number;
  totalAmount: number;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentMethod: 'razorpay' | 'upi' | 'card' | 'cod';
  transactionId?: string;
  shippingAddress: {
    fullName: string;
    phone: string;
    street: string;
    city: string;
    state: string;
    pincode: string;
  };
  currentStatus: OrderWorkflowStatus;
  timeline: ITimelineStep[];
  trackingNumber?: string;
  courierName?: string;
  estimatedDelivery?: string;
  invoiceId?: Types.ObjectId;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema({
  itemType: { type: String, enum: ['product', 'package'], default: 'product' },
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: false },
  packageId: { type: Schema.Types.ObjectId, ref: 'Package', required: false },
  studioId: { type: Schema.Types.ObjectId, ref: 'Studio', required: false },
  title: { type: String, required: true },
  category: { type: String, required: true },
  thumbnail: { type: String, default: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=400&q=80' },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true },
  customization: {
    uploadedPhoto: { type: String },
    customText: { type: String },
    customName: { type: String },
    customDate: { type: String },
    frameColor: { type: String },
    size: { type: String },
    material: { type: String },
    notes: { type: String },
    previewMockup: { type: String }
  },
  itemTotal: { type: Number, required: true }
});

const TimelineStepSchema = new Schema({
  status: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  completed: { type: Boolean, default: false },
  updatedBy: { type: String }
});

const OrderSchema = new Schema<IOrder>(
  {
    orderId: { type: String, required: true, unique: true, index: true },
    customerId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    items: [OrderItemSchema],
    subtotal: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    couponCode: { type: String },
    tax: { type: Number, default: 0 },
    shippingFee: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },
    paymentStatus: { 
      type: String, 
      enum: ['pending', 'paid', 'failed', 'refunded'], 
      default: 'paid',
      index: true 
    },
    paymentMethod: { 
      type: String, 
      enum: ['razorpay', 'upi', 'card', 'cod'], 
      default: 'razorpay' 
    },
    transactionId: { type: String },
    shippingAddress: {
      fullName: { type: String, required: true },
      phone: { type: String, required: true },
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true }
    },
    currentStatus: { 
      type: String, 
      enum: [
        'ORDER_PLACED',
        'PAYMENT_CONFIRMED',
        'PHOTOS_UPLOADED',
        'EDITING',
        'PROOF_READY',
        'CUSTOMER_APPROVED',
        'PRINTING',
        'QUALITY_CHECK',
        'READY',
        'OUT_FOR_DELIVERY',
        'DELIVERED',
        'CANCELLED'
      ],
      default: 'ORDER_PLACED',
      index: true
    },
    timeline: [TimelineStepSchema],
    trackingNumber: { type: String },
    courierName: { type: String, default: 'BlueDart Express' },
    estimatedDelivery: { type: String },
    invoiceId: { type: Schema.Types.ObjectId, ref: 'Invoice' },
    notes: { type: String }
  },
  { timestamps: true }
);

export const Order = mongoose.model<IOrder>('Order', OrderSchema);
