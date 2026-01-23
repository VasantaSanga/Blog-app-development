/**
 * Comment Controller
 * Handles HTTP requests for comment operations
 */

import { Request, Response, NextFunction } from 'express';
import { commentService } from '../services/comment.service.js';
import type { AuthRequest, ApiResponse } from '../types/index.js';

/**
 * Get comments for a blog
 * GET /api/comments/blog/:blogId
 */
export const getBlogComments = async (
  req: Request,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const comments = await commentService.getBlogComments(req.params.blogId);

    res.json({
      status: 'success',
      data: { comments },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create comment
 * POST /api/comments
 */
export const createComment = async (
  req: AuthRequest,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        status: 'error',
        message: 'Not authenticated',
      });
      return;
    }

    const comment = await commentService.createComment(req.user.id, req.body);

    res.status(201).json({
      status: 'success',
      data: { comment },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update comment
 * PUT /api/comments/:id
 */
export const updateComment = async (
  req: AuthRequest,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        status: 'error',
        message: 'Not authenticated',
      });
      return;
    }

    const comment = await commentService.updateComment(
      req.params.id,
      req.user.id,
      req.body
    );

    res.json({
      status: 'success',
      data: { comment },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete comment
 * DELETE /api/comments/:id
 */
export const deleteComment = async (
  req: AuthRequest,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        status: 'error',
        message: 'Not authenticated',
      });
      return;
    }

    await commentService.deleteComment(req.params.id, req.user.id);

    res.json({
      status: 'success',
      message: 'Comment deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Toggle like on comment
 * PUT /api/comments/:id/like
 */
export const toggleLike = async (
  req: AuthRequest,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        status: 'error',
        message: 'Not authenticated',
      });
      return;
    }

    const result = await commentService.toggleLike(req.params.id, req.user.id);

    res.json({
      status: 'success',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
