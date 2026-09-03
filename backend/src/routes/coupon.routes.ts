import { Router } from 'express';
import { 
  getActiveCoupons, 
  validateCoupon, 
  createCoupon, 
  getAllCouponsAdmin 
} from '../controllers/coupon.controller.js';
import { authenticateJWT } from '../middleware/auth.js';
import { authorizeRoles } from '../middleware/roles.js';

const router = Router();

router.get('/active', getActiveCoupons);
router.post('/validate', validateCoupon);
router.get('/admin-all', authenticateJWT, authorizeRoles('admin'), getAllCouponsAdmin);
router.post('/', authenticateJWT, authorizeRoles('admin'), createCoupon);

export default router;
