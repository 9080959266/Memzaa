import { Router } from 'express';
import { 
  getCart, 
  addToCart, 
  updateCartItem, 
  removeCartItem, 
  clearCart,
  applyCartCoupon 
} from '../controllers/cart.controller.js';
import { authenticateJWT } from '../middleware/auth.js';

const router = Router();

router.get('/', authenticateJWT, getCart);
router.post('/', authenticateJWT, addToCart);
router.post('/add', authenticateJWT, addToCart);
router.put('/items/:itemId', authenticateJWT, updateCartItem);
router.put('/item/:itemId', authenticateJWT, updateCartItem);
router.delete('/items/:itemId', authenticateJWT, removeCartItem);
router.delete('/item/:itemId', authenticateJWT, removeCartItem);
router.delete('/clear', authenticateJWT, clearCart);
router.post('/apply-coupon', authenticateJWT, applyCartCoupon);

export default router;
