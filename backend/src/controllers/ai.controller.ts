/**
 * AI Controller
 * Handles HTTP requests for AI-powered content generation
 */

import { Response, NextFunction } from 'express';
import { aiService } from '../services/ai.service.js';
import type { AuthRequest, ApiResponse } from '../types/index.js';

/**
 * Generate blog content using AI
 * POST /api/ai/generate
 */
export const generateContent = async (
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

    if (!aiService.isAvailable()) {
      res.status(503).json({
        status: 'error',
        message: 'AI service is not configured',
      });
      return;
    }

    const { title, tags, category, tone } = req.body;

    // Validate required fields
    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      res.status(400).json({
        status: 'error',
        message: 'Title is required for content generation',
      });
      return;
    }

    console.log('Generating content with:', { title, tags, category, tone });

    const content = await aiService.generateBlogContent({
      title,
      tags,
      category,
      tone,
    });

    res.json({
      status: 'success',
      data: { content },
    });
  } catch (error) {
    console.error('Error in generateContent controller:', error);
    next(error);
  }
};

/**
 * Check AI service availability
 * GET /api/ai/status
 */
export const getStatus = async (
  req: AuthRequest,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    res.json({
      status: 'success',
      data: {
        available: aiService.isAvailable(),
      },
    });
  } catch (error) {
    next(error);
  }
};
