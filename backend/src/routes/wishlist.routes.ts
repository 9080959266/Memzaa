import { Router } from 'express';
import { 
  getWishlist, 
  toggleWishlistStudio, 
  toggleWishlistProduct 
} from '../controllers/wishlist.controller.js';
import { authenticateJWT } from '../middleware/auth.js';

const router = Router();

router.get('/', authenticateJWT, getWishlist);
router.post('/toggle-studio', authenticateJWT, toggleWishlistStudio);
router.post('/toggle-product', authenticateJWT, toggleWishlistProduct);

export default router;
