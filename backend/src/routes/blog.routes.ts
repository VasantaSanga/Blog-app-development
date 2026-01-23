/**
 * Blog Routes
 */

import { Router } from 'express';
import {
  getBlogs,
  getBlogBySlug,
  getBlogById,
  getMyBlogs,
  createBlog,
  updateBlog,
  autoSaveBlog,
  publishBlog,
  unpublishBlog,
  deleteBlog,
  toggleLike,
  getAllTags,
} from '../controllers/blog.controller.js';
import { authGuard, optionalAuthGuard } from '../middleware/authGuard.js';
import { validateBody, validateQuery } from '../middleware/validate.js';
import {
  createBlogSchema,
  updateBlogSchema,
  autoSaveBlogSchema,
  blogQuerySchema,
} from '../validations/blog.validation.js';

const router = Router();

// Public routes
router.get('/', validateQuery(blogQuerySchema), getBlogs);
router.get('/tags', getAllTags);

// Protected routes (order matters - specific routes before parameterized)
router.get('/user/my-blogs', authGuard, getMyBlogs);
router.get('/id/:id', authGuard, getBlogById);

// Semi-public routes (optional auth)
router.get('/:slug', optionalAuthGuard, getBlogBySlug);

// Protected CRUD routes
router.post('/', authGuard, validateBody(createBlogSchema), createBlog);
router.put('/:id', authGuard, validateBody(updateBlogSchema), updateBlog);
router.put('/:id/autosave', authGuard, validateBody(autoSaveBlogSchema), autoSaveBlog);
router.put('/:id/publish', authGuard, publishBlog);
router.put('/:id/unpublish', authGuard, unpublishBlog);
router.put('/:id/like', authGuard, toggleLike);
router.delete('/:id', authGuard, deleteBlog);

export default router;
