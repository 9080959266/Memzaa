"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateBookingStatus = exports.getAllBookingsAdmin = exports.getStudioBookings = exports.getMyBookings = exports.createBooking = void 0;
const Booking_js_1 = require("../models/Booking.js");
const Package_js_1 = require("../models/Package.js");
const Studio_js_1 = require("../models/Studio.js");
const PhotoJob_js_1 = require("../models/PhotoJob.js");
const Invoice_js_1 = require("../models/Invoice.js");
const Notification_js_1 = require("../models/Notification.js");
const createBooking = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ success: false, message: 'Please login to book a photoshoot' });
            return;
        }
        const { packageId, eventDate, timeSlot, venue, notes, specialRequests } = req.body;
        const pkg = await Package_js_1.Package.findById(packageId).populate('studioId');
        if (!pkg) {
            res.status(404).json({ success: false, message: 'Package not found' });
            return;
        }
        const studio = pkg.studioId;
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
            }
            else if (normalizedVenueType.includes('home')) {
                normalizedVenueType = 'customer_home';
            }
            else if (normalizedVenueType.includes('temple') || normalizedVenueType.includes('hall')) {
                normalizedVenueType = 'temple_hall';
            }
            else if (normalizedVenueType.includes('outdoor')) {
                normalizedVenueType = 'outdoor';
            }
            else {
                normalizedVenueType = 'studio';
            }
        }
        const booking = await Booking_js_1.Booking.create({
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
        const photoJob = await PhotoJob_js_1.PhotoJob.create({
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
        const invoice = await Invoice_js_1.Invoice.create({
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
        await Notification_js_1.Notification.create({
            userId: req.user.id,
            title: 'Booking Confirmed! 🎉',
            message: `Your booking #${bookingId} for ${pkg.title} on ${eventDate} is confirmed.`,
            type: 'booking',
            link: '/bookings'
        });
        // Notify Studio Owner
        if (studio.ownerId) {
            await Notification_js_1.Notification.create({
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
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.createBooking = createBooking;
const getMyBookings = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ success: false, message: 'Not authenticated' });
            return;
        }
        const bookings = await Booking_js_1.Booking.find({ customerId: req.user.id })
            .sort({ createdAt: -1 })
            .populate('studioId', 'name city phone email logoImage bannerImage address')
            .populate('packageId', 'title durationHours deliverables bannerImage price');
        res.json({
            success: true,
            bookings
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getMyBookings = getMyBookings;
const getStudioBookings = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ success: false, message: 'Not authenticated' });
            return;
        }
        const studio = await Studio_js_1.Studio.findOne({ ownerId: req.user.id });
        if (!studio) {
            res.status(404).json({ success: false, message: 'Studio not found' });
            return;
        }
        const bookings = await Booking_js_1.Booking.find({ studioId: studio._id })
            .sort({ eventDate: 1 })
            .populate('customerId', 'name email phone avatar')
            .populate('packageId', 'title durationHours deliverables price');
        res.json({
            success: true,
            bookings
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getStudioBookings = getStudioBookings;
const getAllBookingsAdmin = async (req, res) => {
    try {
        const bookings = await Booking_js_1.Booking.find()
            .sort({ createdAt: -1 })
            .populate('customerId', 'name email phone')
            .populate('studioId', 'name city')
            .populate('packageId', 'title price');
        res.json({
            success: true,
            bookings
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getAllBookingsAdmin = getAllBookingsAdmin;
const updateBookingStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { bookingStatus, paymentStatus, cancellationReason } = req.body;
        const booking = await Booking_js_1.Booking.findById(id);
        if (!booking) {
            res.status(404).json({ success: false, message: 'Booking not found' });
            return;
        }
        if (bookingStatus)
            booking.bookingStatus = bookingStatus;
        if (paymentStatus)
            booking.paymentStatus = paymentStatus;
        if (cancellationReason)
            booking.cancellationReason = cancellationReason;
        await booking.save();
        // Send notification to customer
        await Notification_js_1.Notification.create({
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
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.updateBookingStatus = updateBookingStatus;
