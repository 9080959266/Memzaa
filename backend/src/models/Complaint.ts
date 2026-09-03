import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IComplaintMessage {
  senderId: Types.ObjectId;
  senderRole: string;
  senderName: string;
  message: string;
  timestamp: Date;
}

export interface IComplaint extends Document {
  ticketId: string; // e.g. MEM-TKT-304
  userId: Types.ObjectId;
  targetType: 'studio' | 'order' | 'booking' | 'general';
  targetId?: Types.ObjectId;
  subject: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  status: 'open' | 'in_investigation' | 'resolved' | 'closed';
  resolution?: string;
  messages: IComplaintMessage[];
  createdAt: Date;
  updatedAt: Date;
}

const ComplaintMessageSchema = new Schema({
  senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  senderRole: { type: String, required: true },
  senderName: { type: String, required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

const ComplaintSchema = new Schema<IComplaint>(
  {
    ticketId: { type: String, required: true, unique: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    targetType: { 
      type: String, 
      enum: ['studio', 'order', 'booking', 'general'], 
      default: 'general' 
    },
    targetId: { type: Schema.Types.ObjectId },
    subject: { type: String, required: true },
    description: { type: String, required: true },
    priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
    status: { 
      type: String, 
      enum: ['open', 'in_investigation', 'resolved', 'closed'], 
      default: 'open',
      index: true 
    },
    resolution: { type: String },
    messages: [ComplaintMessageSchema]
  },
  { timestamps: true }
);

export const Complaint = mongoose.model<IComplaint>('Complaint', ComplaintSchema);
