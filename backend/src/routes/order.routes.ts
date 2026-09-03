import { Router } from 'express';
import { 
  createOrder, 
  getMyOrders, 
  getOrderById, 
  getAllOrdersAdmin, 
  updateOrderStatus 
} from '../controllers/order.controller.js';
import { authenticateJWT } from '../middleware/auth.js';
import { authorizeRoles } from '../middleware/roles.js';

const router = Router();

router.post('/', authenticateJWT, createOrder);
router.get('/my-orders', authenticateJWT, getMyOrders);
router.get('/admin-all', authenticateJWT, authorizeRoles('admin', 'shop_owner'), getAllOrdersAdmin);
router.get('/:id', authenticateJWT, getOrderById);
router.put('/:id/status', authenticateJWT, authorizeRoles('shop_owner', 'admin'), updateOrderStatus);

export default router;
