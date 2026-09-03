import { Router } from 'express';
import { handleSingleUpload, handleMultipleUpload, handleCustomizerUpload } from '../controllers/upload.controller.js';
import { uploadSingle, uploadMultiple, uploadCustomizer } from '../middleware/upload.js';
import { authenticateJWT } from '../middleware/auth.js';

const router = Router();

router.post('/single', authenticateJWT, uploadSingle, handleSingleUpload);
router.post('/multiple', authenticateJWT, uploadMultiple, handleMultipleUpload);
router.post('/customizer', authenticateJWT, uploadCustomizer, handleCustomizerUpload);

export default router;
