import { Router } from 'express';
import { 
  getAllStudios, 
  getStudioById, 
  compareStudios, 
  getMyStudio, 
  updateStudio, 
  adminApproveStudio 
} from '../controllers/studio.controller.js';
import { authenticateJWT } from '../middleware/auth.js';
import { authorizeRoles } from '../middleware/roles.js';

const router = Router();

router.get('/', getAllStudios);
router.get('/compare', compareStudios);
router.get('/my-studio', authenticateJWT, authorizeRoles('shop_owner'), getMyStudio);
router.put('/my-studio', authenticateJWT, authorizeRoles('shop_owner'), updateStudio);
router.put('/:id/moderate', authenticateJWT, authorizeRoles('admin'), adminApproveStudio);
router.get('/:id', getStudioById);

export default router;
