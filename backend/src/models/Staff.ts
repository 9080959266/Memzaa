import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IStaff extends Document {
  studioId: Types.ObjectId;
  name: string;
  email: string;
  phone: string;
  role: 'lead_photographer' | 'retoucher_editor' | 'lab_technician' | 'studio_assistant';
  avatar?: string;
  specialties: string[];
  assignedTasksCount: number;
  isActive: boolean;
  joinedDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

const StaffSchema = new Schema<IStaff>(
  {
    studioId: { type: Schema.Types.ObjectId, ref: 'Studio', required: true, index: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
    role: {
      type: String,
      enum: ['lead_photographer', 'retoucher_editor', 'lab_technician', 'studio_assistant'],
      default: 'lead_photographer',
      index: true,
    },
    avatar: { type: String, default: '' },
    specialties: [{ type: String }],
    assignedTasksCount: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    joinedDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const Staff = mongoose.model<IStaff>('Staff', StaffSchema);
