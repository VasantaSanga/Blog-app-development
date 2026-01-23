/**
 * Comment Routes
 */

import { Router } from 'express';
import {
  getBlogComments,
  createComment,
  updateComment,
  deleteComment,
  toggleLike,
} from '../controllers/comment.controller.js';
import { authGuard } from '../middleware/authGuard.js';
import { validateBody } from '../middleware/validate.js';
import {
  createCommentSchema,
  updateCommentSchema,
} from '../validations/comment.validation.js';

const router = Router();

// Public routes
router.get('/blog/:blogId', getBlogComments);

// Protected routes
router.post('/', authGuard, validateBody(createCommentSchema), createComment);
router.put('/:id', authGuard, validateBody(updateCommentSchema), updateComment);
router.put('/:id/like', authGuard, toggleLike);
router.delete('/:id', authGuard, deleteComment);

export default router;
