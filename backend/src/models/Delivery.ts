import mongoose, { Document, Schema } from 'mongoose';

export interface IDelivery extends Document {
  orderId: mongoose.Types.ObjectId;
  trackingNumber: string;
  courierName: string;
  shippingLabelUrl?: string;
  senderAddress: {
    name: string;
    phone: string;
    street: string;
    city: string;
    state: string;
    pincode: string;
  };
  deliveryAddress: {
    fullName: string;
    phone: string;
    street: string;
    city: string;
    state: string;
    pincode: string;
  };
  estimatedDeliveryDate: Date;
  actualDeliveryDate?: Date;
  status: 'ready' | 'order_placed' | 'picked_up' | 'dispatched' | 'in_transit' | 'out_for_delivery' | 'delivered' | 'completed' | 'failed';
  trackingTimeline: Array<{
    stage: string;
    location: string;
    description: string;
    timestamp: Date;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const DeliverySchema = new Schema<IDelivery>(
  {
    orderId: { type: Schema.Types.ObjectId, ref: 'Order', required: true, index: true },
    trackingNumber: { type: String, required: true, unique: true, index: true },
    courierName: { type: String, default: 'Blue Dart Express' },
    shippingLabelUrl: { type: String },
    senderAddress: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true },
    },
    deliveryAddress: {
      fullName: { type: String, required: true },
      phone: { type: String, required: true },
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true },
    },
    estimatedDeliveryDate: { type: Date, required: true },
    actualDeliveryDate: { type: Date },
    status: {
      type: String,
      enum: ['ready', 'order_placed', 'picked_up', 'dispatched', 'in_transit', 'out_for_delivery', 'delivered', 'completed', 'failed'],
      default: 'ready',
      index: true,
    },
    trackingTimeline: [
      {
        stage: { type: String, required: true },
        location: { type: String, required: true },
        description: { type: String },
        timestamp: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

export const Delivery = mongoose.model<IDelivery>('Delivery', DeliverySchema);
