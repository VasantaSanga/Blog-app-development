/**
 * AI Validation Schemas
 */

import Joi from 'joi';

export const generateContentSchema = Joi.object({
  title: Joi.string().min(3).max(200).required().messages({
    'string.min': 'Title must be at least 3 characters',
    'string.max': 'Title cannot exceed 200 characters',
    'any.required': 'Title is required for content generation',
  }),
  tags: Joi.array().items(Joi.string().max(50)).max(10).optional().messages({
    'array.max': 'Maximum 10 tags allowed',
  }),
  category: Joi.string().max(100).optional().allow('').messages({
    'string.max': 'Category name cannot exceed 100 characters',
  }),
  tone: Joi.string()
    .valid('professional', 'casual', 'technical', 'creative')
    .optional()
    .default('professional')
    .messages({
      'any.only': 'Tone must be one of: professional, casual, technical, creative',
    }),
});
