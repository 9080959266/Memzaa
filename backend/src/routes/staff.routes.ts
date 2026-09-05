import { Router } from 'express';
import { authenticateJWT } from '../middleware/auth.js';
import { authorizeRoles } from '../middleware/roles.js';
import {
  getStudioStaff,
  addStaffMember,
  updateStaffMember,
  deleteStaffMember,
} from '../controllers/staff.controller.js';

const router = Router();

router.use(authenticateJWT);
router.use(authorizeRoles('shop_owner', 'admin'));

router.get('/', getStudioStaff);
router.post('/', addStaffMember);
router.put('/:id', updateStaffMember);
router.delete('/:id', deleteStaffMember);

export default router;
