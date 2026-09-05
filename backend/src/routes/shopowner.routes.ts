import { Router } from 'express';
import {
  getShopOwnerDashboard,
  getShopOwnerOrders,
  getShopOwnerCustomers,
  getShopOwnerReviews,
  updateStudioSettings,
  toggleBlockDate,
  getShopOwnerOffers,
  createShopOwnerOffer,
  getShopOwnerReports,
} from '../controllers/shopowner.controller.js';
import { authenticateJWT } from '../middleware/auth.js';
import { authorizeRoles } from '../middleware/roles.js';

const router = Router();

router.use(authenticateJWT);
router.use(authorizeRoles('shop_owner', 'admin'));

router.get('/dashboard', getShopOwnerDashboard);
router.get('/orders', getShopOwnerOrders);
router.get('/customers', getShopOwnerCustomers);
router.get('/reviews', getShopOwnerReviews);
router.put('/studio', updateStudioSettings);
router.put('/studio/block-date', toggleBlockDate);
router.get('/offers', getShopOwnerOffers);
router.post('/offers', createShopOwnerOffer);
router.get('/reports', getShopOwnerReports);

export default router;
