/**
 * Validation Middleware
 * Uses Joi schemas for request validation
 */

import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import type { ApiResponse } from '../types/index.js';

type ValidationSource = 'body' | 'query' | 'params';

/**
 * Create validation middleware for a Joi schema
 */
export const validate = (
  schema: Joi.ObjectSchema,
  source: ValidationSource = 'body'
) => {
  return (req: Request, res: Response<ApiResponse>, next: NextFunction): void => {
    const dataToValidate = req[source];

    const { error, value } = schema.validate(dataToValidate, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errors = error.details.map((detail) => ({
        field: detail.path.join('.'),
        message: detail.message,
      }));

      res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors,
      });
      return;
    }

    // Replace request data with validated and sanitized data
    req[source] = value;
    next();
  };
};

/**
 * Validate request body
 */
export const validateBody = (schema: Joi.ObjectSchema) => validate(schema, 'body');

/**
 * Validate query parameters
 */
export const validateQuery = (schema: Joi.ObjectSchema) => validate(schema, 'query');

/**
 * Validate route parameters
 */
export const validateParams = (schema: Joi.ObjectSchema) => validate(schema, 'params');

export default validate;
