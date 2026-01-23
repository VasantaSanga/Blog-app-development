/**
 * Comment Validation Schemas
 */

import Joi from 'joi';

export const createCommentSchema = Joi.object({
  content: Joi.string()
    .min(1)
    .max(2000)
    .required()
    .messages({
      'string.min': 'Comment cannot be empty',
      'string.max': 'Comment cannot exceed 2000 characters',
      'any.required': 'Comment content is required',
    }),
  blogId: Joi.string()
    .uuid()
    .required()
    .messages({
      'string.guid': 'Blog ID must be valid',
      'any.required': 'Blog ID is required',
    }),
  parentCommentId: Joi.string()
    .uuid()
    .allow(null, '')
    .messages({
      'string.guid': 'Parent comment ID must be valid',
    }),
});

export const updateCommentSchema = Joi.object({
  content: Joi.string()
    .min(1)
    .max(2000)
    .required()
    .messages({
      'string.min': 'Comment cannot be empty',
      'string.max': 'Comment cannot exceed 2000 characters',
      'any.required': 'Comment content is required',
    }),
});
