import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IProof extends Document {
  proofId: string; // e.g. MEM-PRF-9021
  photoJobId: Types.ObjectId;
  studioId: Types.ObjectId;
  customerId: Types.ObjectId;
  version: number;
  title: string;
  previewUrls: string[];
  highResUrls: string[];
  watermarked: boolean;
  status: 'pending_review' | 'approved' | 'changes_requested';
  customerFeedback?: string;
  revisionRequests: Array<{
    photoIndex: number;
    comment: string;
    requestedAt: Date;
  }>;
  approvedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const RevisionRequestSchema = new Schema({
  photoIndex: { type: Number, required: true },
  comment: { type: String, required: true },
  requestedAt: { type: Date, default: Date.now }
});

const ProofSchema = new Schema<IProof>(
  {
    proofId: { type: String, required: true, unique: true, index: true },
    photoJobId: { type: Schema.Types.ObjectId, ref: 'PhotoJob', required: true, index: true },
    studioId: { type: Schema.Types.ObjectId, ref: 'Studio', required: true, index: true },
    customerId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    version: { type: Number, default: 1 },
    title: { type: String, required: true },
    previewUrls: [{ type: String, required: true }],
    highResUrls: [{ type: String }],
    watermarked: { type: Boolean, default: true },
    status: { 
      type: String, 
      enum: ['pending_review', 'approved', 'changes_requested'], 
      default: 'pending_review',
      index: true 
    },
    customerFeedback: { type: String },
    revisionRequests: [RevisionRequestSchema],
    approvedAt: { type: Date }
  },
  { timestamps: true }
);

export const Proof = mongoose.model<IProof>('Proof', ProofSchema);
