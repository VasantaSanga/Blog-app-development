/**
 * Error Handler Middleware
 */

import { Request, Response, NextFunction } from 'express';
import type { ApiResponse } from '../types/index.js';

interface AppError extends Error {
  statusCode?: number;
  code?: string;
}

export const errorHandler = (
  err: AppError,
  _req: Request,
  res: Response<ApiResponse>,
  _next: NextFunction
): void => {
  console.error('Error:', err);

  // Prisma errors
  if (err.code === 'P2002') {
    res.status(400).json({
      status: 'error',
      message: 'A record with this value already exists.',
    });
    return;
  }

  if (err.code === 'P2025') {
    res.status(404).json({
      status: 'error',
      message: 'Record not found.',
    });
    return;
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    res.status(401).json({
      status: 'error',
      message: 'Invalid token.',
    });
    return;
  }

  if (err.name === 'TokenExpiredError') {
    res.status(401).json({
      status: 'error',
      message: 'Token has expired.',
    });
    return;
  }

  // Default error
  const statusCode = err.statusCode || 500;
  const message = statusCode === 500 ? 'Internal server error' : err.message;

  res.status(statusCode).json({
    status: 'error',
    message,
  });
};

export const notFoundHandler = (
  req: Request,
  res: Response<ApiResponse>
): void => {
  res.status(404).json({
    status: 'error',
    message: `Route ${req.originalUrl} not found`,
  });
};

export default errorHandler;
