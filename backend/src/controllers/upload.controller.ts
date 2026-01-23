/**
 * Upload Controller
 * Handles HTTP requests for file uploads
 */

import { Request, Response, NextFunction } from 'express';
import { uploadService } from '../services/upload.service.js';
import type { ApiResponse } from '../types/index.js';

/**
 * Upload image
 * POST /api/upload/image
 */
export const uploadImage = async (
  req: Request,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({
        status: 'error',
        message: 'No image file provided',
      });
      return;
    }

    const url = uploadService.getFileUrl(req.file.filename);

    res.json({
      status: 'success',
      data: {
        url,
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete image
 * DELETE /api/upload/image/:filename
 */
export const deleteImage = async (
  req: Request,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    await uploadService.deleteFile(req.params.filename);

    res.json({
      status: 'success',
      message: 'File deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
