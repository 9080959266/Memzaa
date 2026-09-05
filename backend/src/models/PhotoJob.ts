import mongoose, { Document, Schema, Types } from 'mongoose';

export type JobStage =
  | 'NEW_ORDER'
  | 'PHOTOS_UPLOADED'
  | 'EDITING'
  | 'PROOF_READY'
  | 'CUSTOMER_APPROVAL'
  | 'CUSTOMER_APPROVED'
  | 'PRINTING'
  | 'QUALITY_CHECK'
  | 'READY'
  | 'DELIVERY'
  | 'COMPLETED';

export interface IPhotoItem {
  _id?: Types.ObjectId;
  url: string;
  originalName: string;
  sizeBytes?: number;
  status: 'uploaded' | 'selected' | 'rejected';
  rejectionReason?: string;
  comments?: string;
  uploadedAt: Date;
}

export interface IPhotoJob extends Document {
  jobId: string; // e.g. MEM-JOB-7701
  title: string;
  orderId?: Types.ObjectId;
  bookingId?: Types.ObjectId;
  studioId: Types.ObjectId;
  customerId: Types.ObjectId;
  stage: JobStage;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  photos: IPhotoItem[];
  proofVersion: number;
  latestProofUrl?: string;
  customerApprovalStatus: 'pending' | 'approved' | 'changes_requested';
  qcChecklist: Array<{ item: string; checked: boolean }>;
  dueDate?: string;
  assignedEditor?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const PhotoItemSchema = new Schema({
  url: { type: String, required: true },
  originalName: { type: String, required: true },
  sizeBytes: { type: Number },
  status: { type: String, enum: ['uploaded', 'selected', 'rejected'], default: 'uploaded' },
  rejectionReason: { type: String },
  comments: { type: String },
  uploadedAt: { type: Date, default: Date.now }
});

const QCChecklistSchema = new Schema({
  item: { type: String, required: true },
  checked: { type: Boolean, default: false }
});

const PhotoJobSchema = new Schema<IPhotoJob>(
  {
    jobId: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    orderId: { type: Schema.Types.ObjectId, ref: 'Order', index: true },
    bookingId: { type: Schema.Types.ObjectId, ref: 'Booking', index: true },
    studioId: { type: Schema.Types.ObjectId, ref: 'Studio', required: true, index: true },
    customerId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    stage: { 
      type: String, 
      enum: [
        'NEW_ORDER',
        'PHOTOS_UPLOADED',
        'EDITING',
        'PROOF_READY',
        'CUSTOMER_APPROVAL',
        'CUSTOMER_APPROVED',
        'PRINTING',
        'QUALITY_CHECK',
        'READY',
        'DELIVERY',
        'COMPLETED'
      ],
      default: 'NEW_ORDER',
      index: true
    },
    priority: { type: String, enum: ['low', 'medium', 'high', 'urgent'], default: 'medium' },
    photos: [PhotoItemSchema],
    proofVersion: { type: Number, default: 1 },
    latestProofUrl: { type: String },
    customerApprovalStatus: { 
      type: String, 
      enum: ['pending', 'approved', 'changes_requested'], 
      default: 'pending' 
    },
    qcChecklist: {
      type: [QCChecklistSchema],
      default: [
        { item: 'Color grading & skin tone natural check', checked: true },
        { item: 'Resolution 300 DPI verified', checked: true },
        { item: 'No cropping / bleed margins cut off', checked: false },
        { item: 'Physical print / frame defect check', checked: false },
        { item: 'Secure packaging & invoice attached', checked: false }
      ]
    },
    dueDate: { type: String },
    assignedEditor: { type: String, default: 'Lead Colorist' },
    notes: { type: String }
  },
  { timestamps: true }
);

export const PhotoJob = mongoose.model<IPhotoJob>('PhotoJob', PhotoJobSchema);
