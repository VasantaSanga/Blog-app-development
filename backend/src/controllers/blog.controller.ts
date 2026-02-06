/**
 * Blog Controller
 * Handles HTTP requests for blog operations
 */

import { Response, NextFunction, Request } from 'express';
import { blogService } from '../services/blog.service.js';
import type { AuthRequest, ApiResponse } from '../types/index.js';

/**
 * Get client IP address
 */
const getClientIp = (req: Request): string => {
  const forwarded = req.headers['x-forwarded-for'];
  const ip = typeof forwarded === 'string' 
    ? forwarded.split(',')[0]?.trim() 
    : req.headers['x-real-ip'] || req.socket?.remoteAddress || req.ip;
  return (ip as string) || 'unknown';
};

/**
 * Get all published blogs
 * GET /api/blogs
 */
export const getBlogs = async (
  req: Request,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await blogService.getBlogs({
      page: Number(req.query.page) || 1,
      limit: Number(req.query.limit) || 10,
      category: req.query.category as string,
      tag: req.query.tag as string,
      author: req.query.author as string,
      search: req.query.search as string,
    });

    res.json({
      status: 'success',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get blog by slug
 * GET /api/blogs/:slug
 */
export const getBlogBySlug = async (
  req: AuthRequest,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const blog = await blogService.getBlogBySlug(req.params.slug, req.user?.id);

    // Track unique view and get updated view count
    const updatedViewCount = await blogService.trackView(blog.id, req.user?.id, getClientIp(req));
    
    // Update blog object with new view count if view was tracked
    if (updatedViewCount !== null) {
      blog.views = updatedViewCount;
    }

    res.json({
      status: 'success',
      data: { blog },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get blog by ID
 * GET /api/blogs/id/:id
 */
export const getBlogById = async (
  req: AuthRequest,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const blog = await blogService.getBlogById(req.params.id, req.user?.id);

    res.json({
      status: 'success',
      data: { blog },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get user's blogs
 * GET /api/blogs/user/my-blogs
 */
export const getMyBlogs = async (
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

    const result = await blogService.getMyBlogs(req.user.id, {
      page: Number(req.query.page) || 1,
      limit: Number(req.query.limit) || 10,
      status: req.query.status as string,
    });

    res.json({
      status: 'success',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create blog
 * POST /api/blogs
 */
export const createBlog = async (
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

    const blog = await blogService.createBlog(req.user.id, req.body);

    res.status(201).json({
      status: 'success',
      data: { blog },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update blog
 * PUT /api/blogs/:id
 */
export const updateBlog = async (
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

    const blog = await blogService.updateBlog(req.params.id, req.user.id, req.body);

    res.json({
      status: 'success',
      data: { blog },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Auto-save blog
 * PUT /api/blogs/:id/autosave
 */
export const autoSaveBlog = async (
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

    const result = await blogService.autoSaveBlog(req.params.id, req.user.id, req.body);

    res.json({
      status: 'success',
      message: 'Auto-saved successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Publish blog
 * PUT /api/blogs/:id/publish
 */
export const publishBlog = async (
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

    const blog = await blogService.publishBlog(req.params.id, req.user.id);

    res.json({
      status: 'success',
      message: 'Blog published successfully',
      data: { blog },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Unpublish blog
 * PUT /api/blogs/:id/unpublish
 */
export const unpublishBlog = async (
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

    const blog = await blogService.unpublishBlog(req.params.id, req.user.id);

    res.json({
      status: 'success',
      message: 'Blog reverted to draft',
      data: { blog },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete blog
 * DELETE /api/blogs/:id
 */
export const deleteBlog = async (
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

    await blogService.deleteBlog(req.params.id, req.user.id);

    res.json({
      status: 'success',
      message: 'Blog deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Toggle like on blog
 * PUT /api/blogs/:id/like
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

    const result = await blogService.toggleLike(req.params.id, req.user.id);

    res.json({
      status: 'success',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all tags
 * GET /api/blogs/tags
 */
export const getAllTags = async (
  req: Request,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const tags = await blogService.getAllTags();

    res.json({
      status: 'success',
      data: { tags },
    });
  } catch (error) {
    next(error);
  }
};
