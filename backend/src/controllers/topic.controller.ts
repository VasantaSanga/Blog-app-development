/**
 * Topic Controller
 * Handles HTTP requests for topic operations
 */

import { Request, Response, NextFunction } from 'express';
import { topicService } from '../services/topic.service.js';
import type { ApiResponse } from '../types/index.js';

/**
 * Get all topics
 * GET /api/topics
 */
export const getTopics = async (
  req: Request,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const topics = await topicService.getTopics({
      category: req.query.category as string,
      difficulty: req.query.difficulty as string,
      search: req.query.search as string,
    });

    res.json({
      status: 'success',
      data: { topics },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get topic by ID
 * GET /api/topics/:id
 */
export const getTopic = async (
  req: Request,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const topic = await topicService.getTopic(req.params.id);

    res.json({
      status: 'success',
      data: { topic },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get random topics
 * GET /api/topics/random
 */
export const getRandomTopics = async (
  req: Request,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const count = Number(req.query.count) || 5;
    const topics = await topicService.getRandomTopics(count);

    res.json({
      status: 'success',
      data: { topics },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create topic
 * POST /api/topics
 */
export const createTopic = async (
  req: Request,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const topic = await topicService.createTopic(req.body);

    res.status(201).json({
      status: 'success',
      data: { topic },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update topic
 * PUT /api/topics/:id
 */
export const updateTopic = async (
  req: Request,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const topic = await topicService.updateTopic(req.params.id, req.body);

    res.json({
      status: 'success',
      data: { topic },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete topic
 * DELETE /api/topics/:id
 */
export const deleteTopic = async (
  req: Request,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    await topicService.deleteTopic(req.params.id);

    res.json({
      status: 'success',
      message: 'Topic deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
