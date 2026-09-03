import { Router } from 'express';
import { 
  getMyProofs, 
  getStudioProofs, 
  createProof, 
  reviewProof 
} from '../controllers/proof.controller.js';
import { authenticateJWT } from '../middleware/auth.js';
import { authorizeRoles } from '../middleware/roles.js';

const router = Router();

router.get('/my-proofs', authenticateJWT, getMyProofs);
router.get('/studio-proofs', authenticateJWT, authorizeRoles('shop_owner', 'admin'), getStudioProofs);
router.post('/', authenticateJWT, authorizeRoles('shop_owner', 'admin'), createProof);
router.put('/:id/review', authenticateJWT, reviewProof);

export default router;
