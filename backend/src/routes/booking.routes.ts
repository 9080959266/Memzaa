import { Router } from 'express';
import { 
  createBooking, 
  getMyBookings, 
  getStudioBookings, 
  getAllBookingsAdmin, 
  updateBookingStatus 
} from '../controllers/booking.controller.js';
import { authenticateJWT } from '../middleware/auth.js';
import { authorizeRoles } from '../middleware/roles.js';

const router = Router();

router.post('/', authenticateJWT, createBooking);
router.get('/my', authenticateJWT, getMyBookings);
router.get('/my-bookings', authenticateJWT, getMyBookings);
router.get('/studio-bookings', authenticateJWT, authorizeRoles('shop_owner'), getStudioBookings);
router.get('/studio/:studioId', authenticateJWT, authorizeRoles('shop_owner', 'admin'), getStudioBookings);
router.get('/admin-all', authenticateJWT, authorizeRoles('admin'), getAllBookingsAdmin);
router.put('/:id/status', authenticateJWT, authorizeRoles('shop_owner', 'admin'), updateBookingStatus);

export default router;
