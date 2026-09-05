import { Router } from 'express';
import { authenticateJWT } from '../middleware/auth.js';
import {
  getMyPhotos,
  addPhoto,
  toggleFavouritePhoto,
  deletePhoto,
  downloadPhoto,
} from '../controllers/photo.controller.js';

const router = Router();

router.use(authenticateJWT);

router.get('/', getMyPhotos);
router.get('/:id/download', downloadPhoto);
router.post('/', addPhoto);
router.put('/:id/favourite', toggleFavouritePhoto);
router.delete('/:id', deletePhoto);

export default router;
