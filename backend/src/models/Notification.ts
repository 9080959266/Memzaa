import mongoose, { Document, Schema, Types } from 'mongoose';

export interface INotification extends Document {
  userId: Types.ObjectId;
  title: string;
  message: string;
  type: 'booking' | 'order' | 'proof' | 'payment' | 'system' | 'review' | 'inventory';
  link?: string;
  isRead: boolean;
  metadata?: Record<string, any>;
  createdAt: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: { 
      type: String, 
      enum: ['booking', 'order', 'proof', 'payment', 'system', 'review', 'inventory'], 
      default: 'system' 
    },
    link: { type: String },
    isRead: { type: Boolean, default: false, index: true },
    metadata: { type: Schema.Types.Mixed }
  },
  { timestamps: true }
);

export const Notification = mongoose.model<INotification>('Notification', NotificationSchema);
