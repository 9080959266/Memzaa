import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IPayment extends Document {
  paymentId: string; // e.g. MEM-PAY-1102
  orderId?: Types.ObjectId;
  bookingId?: Types.ObjectId;
  userId: Types.ObjectId;
  amount: number;
  currency: string;
  gateway: 'razorpay' | 'mock_upi' | 'card' | 'netbanking' | 'cod';
  gatewayPaymentId?: string;
  gatewayOrderId?: string;
  gatewaySignature?: string;
  status: 'initiated' | 'success' | 'failed' | 'refunded';
  receiptNumber: string;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema = new Schema<IPayment>(
  {
    paymentId: { type: String, required: true, unique: true, index: true },
    orderId: { type: Schema.Types.ObjectId, ref: 'Order', index: true },
    bookingId: { type: Schema.Types.ObjectId, ref: 'Booking', index: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    amount: { type: Number, required: true, min: 0 },
    currency: { type: String, default: 'INR' },
    gateway: { 
      type: String, 
      enum: ['razorpay', 'mock_upi', 'card', 'netbanking', 'cod'], 
      default: 'razorpay' 
    },
    gatewayPaymentId: { type: String },
    gatewayOrderId: { type: String },
    gatewaySignature: { type: String },
    status: { 
      type: String, 
      enum: ['initiated', 'success', 'failed', 'refunded'], 
      default: 'success',
      index: true 
    },
    receiptNumber: { type: String, required: true }
  },
  { timestamps: true }
);

export const Payment = mongoose.model<IPayment>('Payment', PaymentSchema);
