/**
 * Upload Routes
 */

import { Router } from 'express';
import { uploadImage, deleteImage } from '../controllers/upload.controller.js';
import { authGuard } from '../middleware/authGuard.js';
import { upload } from '../middleware/upload.js';

const router = Router();

// Protected routes
router.post('/image', authGuard, upload.single('image'), uploadImage);
router.delete('/image/:filename', authGuard, deleteImage);

export default router;
