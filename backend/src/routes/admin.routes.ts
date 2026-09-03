import { Router } from 'express';
import { 
  getAdminDashboard, 
  getAdminUsers, 
  toggleUserStatus, 
  getComplaints, 
  updateComplaintStatus 
} from '../controllers/admin.controller.js';
import { authenticateJWT } from '../middleware/auth.js';
import { authorizeRoles } from '../middleware/roles.js';

const router = Router();

router.get('/dashboard', authenticateJWT, authorizeRoles('admin'), getAdminDashboard);
router.get('/users', authenticateJWT, authorizeRoles('admin'), getAdminUsers);
router.put('/users/:id/toggle-status', authenticateJWT, authorizeRoles('admin'), toggleUserStatus);
router.get('/complaints', authenticateJWT, authorizeRoles('admin'), getComplaints);
router.put('/complaints/:id/status', authenticateJWT, authorizeRoles('admin'), updateComplaintStatus);

export default router;
