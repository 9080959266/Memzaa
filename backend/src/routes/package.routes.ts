import { Router } from 'express';
import { 
  getPackages, 
  getPackageById, 
  getPackagesByStudio,
  createPackage, 
  updatePackage, 
  deletePackage 
} from '../controllers/package.controller.js';
import { authenticateJWT } from '../middleware/auth.js';
import { authorizeRoles } from '../middleware/roles.js';

const router = Router();

router.get('/', getPackages);
router.get('/studio/:studioId', getPackagesByStudio);
router.get('/:id', getPackageById);
router.post('/', authenticateJWT, authorizeRoles('shop_owner', 'admin'), createPackage);
router.put('/:id', authenticateJWT, authorizeRoles('shop_owner', 'admin'), updatePackage);
router.delete('/:id', authenticateJWT, authorizeRoles('shop_owner', 'admin'), deletePackage);

export default router;
