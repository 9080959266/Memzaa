import { Router } from 'express';
import { 
  getCart, 
  addToCart, 
  updateCartItem, 
  removeCartItem, 
  applyCartCoupon 
} from '../controllers/cart.controller.js';
import { authenticateJWT } from '../middleware/auth.js';

const router = Router();

router.get('/', authenticateJWT, getCart);
router.post('/add', authenticateJWT, addToCart);
router.put('/items/:itemId', authenticateJWT, updateCartItem);
router.delete('/items/:itemId', authenticateJWT, removeCartItem);
router.post('/apply-coupon', authenticateJWT, applyCartCoupon);

export default router;
