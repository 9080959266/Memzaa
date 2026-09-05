import { Response } from 'express';
import { Booking } from '../models/Booking.js';
import { Package } from '../models/Package.js';
import { Studio } from '../models/Studio.js';
import { PhotoJob } from '../models/PhotoJob.js';
import { Invoice } from '../models/Invoice.js';
import { Notification } from '../models/Notification.js';
import { AuthRequest } from '../middleware/auth.js';

export const createBooking = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Please login to book a photoshoot' });
      return;
    }

    const { packageId, eventDate, timeSlot, venue, notes, specialRequests } = req.body;

    const pkg = await Package.findById(packageId).populate('studioId');
    if (!pkg) {
      res.status(404).json({ success: false, message: 'Package not found' });
      return;
    }

    const studio: any = pkg.studioId;
    const totalAmount = pkg.discountPrice || pkg.price;
    const advanceAmount = Math.round((totalAmount * (pkg.advancePercentage || 20)) / 100);
    const remainingAmount = totalAmount - advanceAmount;

    // Generate unique booking ID
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const bookingId = `MEM-BKG-${randomSuffix}`;

    // Normalize venueType to match Mongoose enum: ['studio', 'outdoor', 'customer_home', 'resort_hotel', 'temple_hall']
    let normalizedVenueType = (venue?.venueType || 'studio').toLowerCase().replace(/\s+/g, '_');
    if (!['studio', 'outdoor', 'customer_home', 'resort_hotel', 'temple_hall'].includes(normalizedVenueType)) {
      if (normalizedVenueType.includes('hotel') || normalizedVenueType.includes('resort')) {
        normalizedVenueType = 'resort_hotel';
      } else if (normalizedVenueType.includes('home')) {
        normalizedVenueType = 'customer_home';
      } else if (normalizedVenueType.includes('temple') || normalizedVenueType.includes('hall')) {
        normalizedVenueType = 'temple_hall';
      } else if (normalizedVenueType.includes('outdoor')) {
        normalizedVenueType = 'outdoor';
      } else {
        normalizedVenueType = 'studio';
      }
    }

    const booking = await Booking.create({
      bookingId,
      customerId: req.user.id,
      studioId: studio._id,
      packageId: pkg._id,
      eventDate,
      timeSlot,
      venue: {
        address: venue?.address || studio.address,
        city: venue?.city || studio.city,
        landmark: venue?.landmark || '',
        pincode: venue?.pincode || '600001',
        venueType: normalizedVenueType
      },
      totalAmount,
      advanceAmount,
      remainingAmount,
      paymentStatus: 'advance_paid',
      bookingStatus: 'confirmed',
      notes,
      specialRequests
    });

    // Create corresponding PhotoJob for the studio's Kanban workflow
    const jobSuffix = Math.floor(1000 + Math.random() * 9000);
    const photoJob = await PhotoJob.create({
      jobId: `MEM-JOB-${jobSuffix}`,
      title: `${pkg.title} - ${req.user.name}`,
      bookingId: booking._id,
      studioId: studio._id,
      customerId: req.user.id,
      stage: 'NEW_ORDER',
      priority: 'high',
      dueDate: eventDate,
      notes: `Event Date: ${eventDate} (${timeSlot}). Venue: ${venue?.address || studio.address}`
    });

    // Generate initial Advance Invoice
    const invSuffix = Math.floor(1000 + Math.random() * 9000);
    const invoice = await Invoice.create({
      invoiceNumber: `MEM-INV-${invSuffix}`,
      bookingId: booking._id,
      userId: req.user.id,
      studioId: studio._id,
      customerDetails: {
        name: req.user.name,
        email: req.user.email,
        phone: req.body.phone || '+91 98765 43210',
        address: venue?.address || 'Customer Address',
        city: venue?.city || studio.city,
        pincode: venue?.pincode || '600001'
      },
      items: [
        {
          description: `${pkg.title} (Advance Booking Deposit - ${pkg.advancePercentage}%)`,
          quantity: 1,
          unitPrice: advanceAmount,
          taxRate: 18,
          total: advanceAmount
        }
      ],
      subtotal: advanceAmount,
      discount: 0,
      taxAmount: Math.round(advanceAmount * 0.18),
      grandTotal: advanceAmount,
      paymentStatus: 'paid',
      paymentMethod: 'UPI / Online'
    });

    // Notify Customer
    await Notification.create({
      userId: req.user.id,
      title: 'Booking Confirmed! 🎉',
      message: `Your booking #${bookingId} for ${pkg.title} on ${eventDate} is confirmed.`,
      type: 'booking',
      link: '/bookings'
    });

    // Notify Studio Owner
    if (studio.ownerId) {
      await Notification.create({
        userId: studio.ownerId,
        title: 'New Photoshoot Booking! 📷',
        message: `${req.user.name} booked ${pkg.title} for ${eventDate} (${timeSlot}).`,
        type: 'booking',
        link: '/seller/bookings'
      });
    }

    res.status(201).json({
      success: true,
      message: 'Booking created successfully!',
      booking,
      photoJobId: photoJob._id,
      invoiceId: invoice._id
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMyBookings = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated' });
      return;
    }

    const bookings = await Booking.find({ customerId: req.user.id })
      .sort({ createdAt: -1 })
      .populate('studioId', 'name city phone email logoImage bannerImage address')
      .populate('packageId', 'title durationHours deliverables bannerImage price');

    res.json({
      success: true,
      bookings
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getStudioBookings = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated' });
      return;
    }

    const studio = await Studio.findOne({ ownerId: req.user.id });
    if (!studio) {
      res.status(404).json({ success: false, message: 'Studio not found' });
      return;
    }

    const bookings = await Booking.find({ studioId: studio._id })
      .sort({ eventDate: 1 })
      .populate('customerId', 'name email phone avatar')
      .populate('packageId', 'title durationHours deliverables price');

    res.json({
      success: true,
      bookings
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllBookingsAdmin = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const bookings = await Booking.find()
      .sort({ createdAt: -1 })
      .populate('customerId', 'name email phone')
      .populate('studioId', 'name city')
      .populate('packageId', 'title price');

    res.json({
      success: true,
      bookings
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateBookingStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { bookingStatus, paymentStatus, cancellationReason } = req.body;

    const booking = await Booking.findById(id);
    if (!booking) {
      res.status(404).json({ success: false, message: 'Booking not found' });
      return;
    }

    if (bookingStatus) booking.bookingStatus = bookingStatus;
    if (paymentStatus) booking.paymentStatus = paymentStatus;
    if (cancellationReason) booking.cancellationReason = cancellationReason;

    await booking.save();

    // Send notification to customer
    await Notification.create({
      userId: booking.customerId,
      title: `Booking Update: #${booking.bookingId}`,
      message: `Your booking status has been updated to ${booking.bookingStatus.toUpperCase()}`,
      type: 'booking',
      link: '/bookings'
    });

    res.json({
      success: true,
      message: 'Booking status updated successfully',
      booking
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
