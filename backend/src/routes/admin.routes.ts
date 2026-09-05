import { Router } from 'express';
import { 
  getAdminDashboard, 
  getAdminUsers, 
  getAdminUserDetails,
  moderateShopOwner,
  toggleUserStatus, 
  getComplaints, 
  updateComplaintStatus,
  getAdminBookings,
  getAdminOrders,
  getAdminPayments,
  getAdminReviews,
  getAdminProducts,
  getAdminDeliveries,
  updateDeliveryStatus,
  getAdminCommission,
  moderateReview,
  getAdminPackages,
  togglePackageStatus,
  updateAdminBookingStatus,
  updateAdminOrderStatus,
  getAdminReports,
  getAdminNotifications,
  markAllAdminNotificationsRead,
  getAdminSettings,
  updateAdminSettings,
} from '../controllers/admin.controller.js';
import { authenticateJWT } from '../middleware/auth.js';
import { authorizeRoles } from '../middleware/roles.js';

const router = Router();

router.use(authenticateJWT);
router.use(authorizeRoles('admin'));

router.get('/dashboard', getAdminDashboard);
router.get('/users', getAdminUsers);
router.get('/users/:id/details', getAdminUserDetails);
router.put('/users/:id/shop-owner-status', moderateShopOwner);
router.put('/users/:id/toggle-status', toggleUserStatus);
router.get('/complaints', getComplaints);
router.put('/complaints/:id/status', updateComplaintStatus);
router.get('/bookings', getAdminBookings);
router.put('/bookings/:id/status', updateAdminBookingStatus);
router.get('/orders', getAdminOrders);
router.put('/orders/:id/status', updateAdminOrderStatus);
router.get('/payments', getAdminPayments);
router.get('/reviews', getAdminReviews);
router.put('/reviews/:id/moderate', moderateReview);
router.get('/products', getAdminProducts);
router.get('/packages', getAdminPackages);
router.put('/packages/:id/toggle-status', togglePackageStatus);
router.get('/deliveries', getAdminDeliveries);
router.put('/deliveries/:id/status', updateDeliveryStatus);
router.get('/commission', getAdminCommission);
router.get('/reports', getAdminReports);
router.get('/notifications', getAdminNotifications);
router.put('/notifications/mark-all-read', markAllAdminNotificationsRead);
router.get('/settings', getAdminSettings);
router.put('/settings', updateAdminSettings);

export default router;
