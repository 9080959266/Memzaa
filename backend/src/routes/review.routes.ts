import { Router } from 'express';
import { addReview, replyToReview, getReviewsByTarget } from '../controllers/review.controller.js';
import { authenticateJWT } from '../middleware/auth.js';
import { authorizeRoles } from '../middleware/roles.js';

const router = Router();

router.get('/:targetType/:targetId', getReviewsByTarget);
router.post('/', authenticateJWT, addReview);
router.put('/:id/reply', authenticateJWT, authorizeRoles('shop_owner', 'admin'), replyToReview);

export default router;
