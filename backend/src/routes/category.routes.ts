import { Router } from 'express';
import { getCategories, createCategory, updateCategory } from '../controllers/category.controller.js';
import { authenticateJWT } from '../middleware/auth.js';
import { authorizeRoles } from '../middleware/roles.js';

const router = Router();

router.get('/', getCategories);
router.post('/', authenticateJWT, authorizeRoles('admin'), createCategory);
router.put('/:id', authenticateJWT, authorizeRoles('admin'), updateCategory);

export default router;
