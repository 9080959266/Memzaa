import { Router } from 'express';
import { authenticateJWT } from '../middleware/auth.js';
import { requireRole } from '../middleware/roles.js';
import {
  getDeliveryByOrder,
  getDeliveryByTrackingNumber,
  updateDeliveryStatus,
} from '../controllers/delivery.controller.js';

const router = Router();

// Public tracking lookup
router.get('/track/:trackingNumber', getDeliveryByTrackingNumber);

// Authenticated order delivery lookup
router.get('/order/:orderId', authenticateJWT, getDeliveryByOrder);

// Shop owner & Admin status updates
router.put('/:id/status', authenticateJWT, requireRole(['shop_owner', 'admin']), updateDeliveryStatus);

export default router;
