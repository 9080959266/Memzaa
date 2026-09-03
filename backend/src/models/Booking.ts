import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IBooking extends Document {
  bookingId: string; // e.g. MEM-BKG-1001
  customerId: Types.ObjectId;
  studioId: Types.ObjectId;
  packageId: Types.ObjectId;
  eventDate: string; // YYYY-MM-DD
  timeSlot: string; // e.g. 10:00 AM - 01:00 PM
  venue: {
    address: string;
    city: string;
    landmark?: string;
    pincode?: string;
    venueType: 'studio' | 'outdoor' | 'customer_home' | 'resort_hotel' | 'temple_hall';
  };
  totalAmount: number;
  advanceAmount: number;
  remainingAmount: number;
  paymentStatus: 'pending' | 'advance_paid' | 'fully_paid' | 'refunded';
  bookingStatus: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  advancePaymentId?: string;
  notes?: string;
  specialRequests?: string;
  cancellationReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>(
  {
    bookingId: { type: String, required: true, unique: true, index: true },
    customerId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    studioId: { type: Schema.Types.ObjectId, ref: 'Studio', required: true, index: true },
    packageId: { type: Schema.Types.ObjectId, ref: 'Package', required: true },
    eventDate: { type: String, required: true, index: true },
    timeSlot: { type: String, required: true },
    venue: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      landmark: { type: String },
      pincode: { type: String },
      venueType: { 
        type: String, 
        enum: ['studio', 'outdoor', 'customer_home', 'resort_hotel', 'temple_hall'], 
        default: 'studio' 
      }
    },
    totalAmount: { type: Number, required: true },
    advanceAmount: { type: Number, required: true },
    remainingAmount: { type: Number, required: true },
    paymentStatus: { 
      type: String, 
      enum: ['pending', 'advance_paid', 'fully_paid', 'refunded'], 
      default: 'advance_paid' 
    },
    bookingStatus: { 
      type: String, 
      enum: ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled'], 
      default: 'confirmed',
      index: true
    },
    advancePaymentId: { type: String },
    notes: { type: String },
    specialRequests: { type: String },
    cancellationReason: { type: String }
  },
  { timestamps: true }
);

export const Booking = mongoose.model<IBooking>('Booking', BookingSchema);
