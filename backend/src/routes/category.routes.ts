/**
 * Category Routes
 */

import { Router } from 'express';
import {
  getCategories,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../controllers/category.controller.js';
import { authGuard, adminGuard } from '../middleware/authGuard.js';
import { validateBody } from '../middleware/validate.js';
import {
  createCategorySchema,
  updateCategorySchema,
} from '../validations/category.validation.js';

const router = Router();

// Public routes
router.get('/', getCategories);
router.get('/:slug', getCategoryBySlug);

// Admin only routes
router.post('/', authGuard, adminGuard, validateBody(createCategorySchema), createCategory);
router.put('/:id', authGuard, adminGuard, validateBody(updateCategorySchema), updateCategory);
router.delete('/:id', authGuard, adminGuard, deleteCategory);

export default router;
