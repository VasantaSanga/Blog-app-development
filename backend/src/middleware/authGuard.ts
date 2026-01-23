/**
 * Auth Guard Middleware
 * Protects routes that require authentication
 */

import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import prisma from '../config/prisma.js';
import config from '../config/env.js';
import type { AuthRequest, UserPayload, ApiResponse } from '../types/index.js';

/**
 * Protect routes - Require authentication
 */
export const authGuard = async (
  req: AuthRequest,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        status: 'error',
        message: 'Access denied. No token provided.',
      });
      return;
    }

    const token = authHeader.split(' ')[1];

    try {
      const decoded = jwt.verify(token, config.jwtSecret) as UserPayload;

      // Verify user still exists
      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: { id: true, email: true, name: true, role: true },
      });

      if (!user) {
        res.status(401).json({
          status: 'error',
          message: 'User no longer exists.',
        });
        return;
      }

      req.user = {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      };

      next();
    } catch (jwtError) {
      res.status(401).json({
        status: 'error',
        message: 'Invalid or expired token.',
      });
      return;
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Optional auth - Attaches user if token is valid, but doesn't require it
 */
export const optionalAuthGuard = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next();
    }

    const token = authHeader.split(' ')[1];

    try {
      const decoded = jwt.verify(token, config.jwtSecret) as UserPayload;

      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: { id: true, email: true, name: true, role: true },
      });

      if (user) {
        req.user = {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      }
    } catch {
      // Token invalid, but that's okay for optional auth
    }

    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Admin guard - Require admin role
 */
export const adminGuard = (
  req: AuthRequest,
  res: Response<ApiResponse>,
  next: NextFunction
): void => {
  if (!req.user) {
    res.status(401).json({
      status: 'error',
      message: 'Authentication required.',
    });
    return;
  }

  if (req.user.role !== 'ADMIN') {
    res.status(403).json({
      status: 'error',
      message: 'Admin access required.',
    });
    return;
  }

  next();
};

export default authGuard;
