import { Router } from 'express';
import { getShopOwnerDashboard } from '../controllers/shopowner.controller.js';
import { authenticateJWT } from '../middleware/auth.js';
import { authorizeRoles } from '../middleware/roles.js';

const router = Router();

router.get('/dashboard', authenticateJWT, authorizeRoles('shop_owner'), getShopOwnerDashboard);

export default router;
