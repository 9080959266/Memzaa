import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IInvoiceLineItem {
  description: string;
  quantity: number;
  unitPrice: number;
  taxRate: number; // e.g. 18 for 18% GST
  total: number;
}

export interface IInvoice extends Document {
  invoiceNumber: string; // e.g. MEM-INV-2025-0012
  orderId?: Types.ObjectId;
  bookingId?: Types.ObjectId;
  userId: Types.ObjectId;
  studioId?: Types.ObjectId;
  customerDetails: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    pincode: string;
  };
  sellerDetails: {
    businessName: string;
    gstin?: string;
    pan?: string;
    address: string;
    email: string;
    phone: string;
  };
  items: IInvoiceLineItem[];
  subtotal: number;
  discount: number;
  taxAmount: number;
  grandTotal: number;
  paymentStatus: 'paid' | 'pending' | 'partially_paid';
  paymentMethod: string;
  paymentRef?: string;
  issuedDate: Date;
  dueDate?: Date;
  pdfUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const InvoiceLineItemSchema = new Schema({
  description: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
  unitPrice: { type: Number, required: true },
  taxRate: { type: Number, default: 18 },
  total: { type: Number, required: true }
});

const InvoiceSchema = new Schema<IInvoice>(
  {
    invoiceNumber: { type: String, required: true, unique: true, index: true },
    orderId: { type: Schema.Types.ObjectId, ref: 'Order', index: true },
    bookingId: { type: Schema.Types.ObjectId, ref: 'Booking', index: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    studioId: { type: Schema.Types.ObjectId, ref: 'Studio' },
    customerDetails: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      pincode: { type: String, required: true }
    },
    sellerDetails: {
      businessName: { type: String, default: 'MEMORA Experiences Pvt. Ltd.' },
      gstin: { type: String, default: '33AABCM9988C1Z8' },
      pan: { type: String, default: 'AABCM9988C' },
      address: { type: String, default: '45, Cathedral Road, Anna Nagar, Chennai - 600086, India' },
      email: { type: String, default: 'billing@memora.com' },
      phone: { type: String, default: '+91 98400 12345' }
    },
    items: [InvoiceLineItemSchema],
    subtotal: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    taxAmount: { type: Number, default: 0 },
    grandTotal: { type: Number, required: true },
    paymentStatus: { type: String, enum: ['paid', 'pending', 'partially_paid'], default: 'paid' },
    paymentMethod: { type: String, default: 'UPI / Online' },
    paymentRef: { type: String },
    issuedDate: { type: Date, default: Date.now },
    dueDate: { type: Date },
    pdfUrl: { type: String }
  },
  { timestamps: true }
);

export const Invoice = mongoose.model<IInvoice>('Invoice', InvoiceSchema);
