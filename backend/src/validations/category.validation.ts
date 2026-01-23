/**
 * Category Validation Schemas
 */

import Joi from 'joi';

export const createCategorySchema = Joi.object({
  name: Joi.string()
    .min(1)
    .max(50)
    .required()
    .messages({
      'string.min': 'Category name is required',
      'string.max': 'Name cannot exceed 50 characters',
      'any.required': 'Category name is required',
    }),
  description: Joi.string()
    .max(200)
    .allow('', null)
    .messages({
      'string.max': 'Description cannot exceed 200 characters',
    }),
  color: Joi.string()
    .pattern(/^#[0-9A-Fa-f]{6}$/)
    .default('#6366f1')
    .messages({
      'string.pattern.base': 'Color must be a valid hex color code',
    }),
  icon: Joi.string()
    .max(50)
    .default('article')
    .messages({
      'string.max': 'Icon name cannot exceed 50 characters',
    }),
});

export const updateCategorySchema = Joi.object({
  name: Joi.string()
    .min(1)
    .max(50)
    .messages({
      'string.min': 'Category name cannot be empty',
      'string.max': 'Name cannot exceed 50 characters',
    }),
  description: Joi.string()
    .max(200)
    .allow('', null),
  color: Joi.string()
    .pattern(/^#[0-9A-Fa-f]{6}$/),
  icon: Joi.string()
    .max(50),
});
