import { Router } from 'express';
import { getNotifications, markAsRead, markAllAsRead } from '../controllers/notification.controller.js';
import { authenticateJWT } from '../middleware/auth.js';

const router = Router();

router.get('/', authenticateJWT, getNotifications);
router.put('/:id/read', authenticateJWT, markAsRead);
router.put('/mark-all-read', authenticateJWT, markAllAsRead);

export default router;
