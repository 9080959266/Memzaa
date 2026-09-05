import { Router } from 'express';
import {
  register,
  login,
  googleAuth,
  getMe,
  updateProfile,
  addAddress,
  deleteAddress,
} from '../controllers/auth.controller.js';
import { authenticateJWT } from '../middleware/auth.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/google', googleAuth);
router.get('/me', authenticateJWT, getMe);
router.put('/profile', authenticateJWT, updateProfile);
router.post('/addresses', authenticateJWT, addAddress);
router.delete('/addresses/:addressId', authenticateJWT, deleteAddress);

export default router;
