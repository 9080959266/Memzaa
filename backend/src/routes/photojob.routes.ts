import { Router } from 'express';
import { 
  getStudioKanbanJobs, 
  updateJobStage, 
  uploadJobPhotos, 
  customerSelectPhotos, 
  updateQCChecklist 
} from '../controllers/photojob.controller.js';
import { authenticateJWT } from '../middleware/auth.js';
import { authorizeRoles } from '../middleware/roles.js';

const router = Router();

router.get('/kanban', authenticateJWT, authorizeRoles('shop_owner', 'admin'), getStudioKanbanJobs);
router.put('/:id/stage', authenticateJWT, authorizeRoles('shop_owner', 'admin'), updateJobStage);
router.post('/:id/upload-photos', authenticateJWT, uploadJobPhotos);
router.post('/:id/select-photos', authenticateJWT, customerSelectPhotos);
router.put('/:id/qc', authenticateJWT, authorizeRoles('shop_owner', 'admin'), updateQCChecklist);

export default router;
