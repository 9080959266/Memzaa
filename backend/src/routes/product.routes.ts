import { Router } from 'express';
import { 
  getProducts, 
  getProductBySlug, 
  createProduct, 
  updateProduct, 
  deleteProduct 
} from '../controllers/product.controller.js';
import { authenticateJWT } from '../middleware/auth.js';
import { authorizeRoles } from '../middleware/roles.js';

const router = Router();

router.get('/', getProducts);
router.get('/:slug', getProductBySlug);
router.post('/', authenticateJWT, authorizeRoles('shop_owner', 'admin'), createProduct);
router.put('/:id', authenticateJWT, authorizeRoles('shop_owner', 'admin'), updateProduct);
router.delete('/:id', authenticateJWT, authorizeRoles('admin'), deleteProduct);

export default router;
