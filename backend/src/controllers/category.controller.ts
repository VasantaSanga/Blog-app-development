/**
 * Category Controller
 * Handles HTTP requests for category operations
 */

import { Request, Response, NextFunction } from 'express';
import { categoryService } from '../services/category.service.js';
import type { ApiResponse } from '../types/index.js';

/**
 * Get all categories
 * GET /api/categories
 */
export const getCategories = async (
  req: Request,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const categories = await categoryService.getCategories();

    res.json({
      status: 'success',
      data: { categories },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get category by slug
 * GET /api/categories/:slug
 */
export const getCategoryBySlug = async (
  req: Request,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const category = await categoryService.getCategoryBySlug(req.params.slug);

    res.json({
      status: 'success',
      data: { category },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create category
 * POST /api/categories
 */
export const createCategory = async (
  req: Request,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const category = await categoryService.createCategory(req.body);

    res.status(201).json({
      status: 'success',
      data: { category },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update category
 * PUT /api/categories/:id
 */
export const updateCategory = async (
  req: Request,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const category = await categoryService.updateCategory(req.params.id, req.body);

    res.json({
      status: 'success',
      data: { category },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete category
 * DELETE /api/categories/:id
 */
export const deleteCategory = async (
  req: Request,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    await categoryService.deleteCategory(req.params.id);

    res.json({
      status: 'success',
      message: 'Category deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
