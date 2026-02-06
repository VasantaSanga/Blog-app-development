/**
 * Blog Validation Schemas
 */

import Joi from 'joi';

export const createBlogSchema = Joi.object({
  title: Joi.string()
    .min(1)
    .max(200)
    .required()
    .messages({
      'string.min': 'Title is required',
      'string.max': 'Title cannot exceed 200 characters',
      'any.required': 'Title is required',
    }),
  content: Joi.string()
    .min(1)
    .required()
    .messages({
      'string.min': 'Content is required',
      'any.required': 'Content is required',
    }),
  excerpt: Joi.string()
    .max(500)
    .allow('', null)
    .messages({
      'string.max': 'Excerpt cannot exceed 500 characters',
    }),
  coverImage: Joi.string()
    .allow('', null)
    .custom((value, helpers) => {
      // Allow empty string or null
      if (!value || value === '') {
        return value;
      }
      // Allow relative paths (starting with /)
      if (value.startsWith('/')) {
        return value;
      }
      // Validate as URI for absolute URLs
      try {
        new URL(value);
        return value;
      } catch {
        return helpers.error('string.uri');
      }
    })
    .messages({
      'string.uri': 'Cover image must be a valid URL or file path',
    }),
  category: Joi.string()
    .uuid()
    .allow(null, '')
    .messages({
      'string.guid': 'Category must be a valid ID',
    }),
  tags: Joi.array()
    .items(Joi.string().max(30))
    .max(10)
    .messages({
      'array.max': 'Maximum 10 tags allowed',
    }),
  status: Joi.string()
    .valid('draft', 'published')
    .default('draft')
    .messages({
      'any.only': 'Status must be either draft or published',
    }),
  basedOnTopic: Joi.string()
    .uuid()
    .allow(null, '')
    .messages({
      'string.guid': 'Topic must be a valid ID',
    }),
});

export const updateBlogSchema = Joi.object({
  title: Joi.string()
    .min(1)
    .max(200)
    .messages({
      'string.min': 'Title cannot be empty',
      'string.max': 'Title cannot exceed 200 characters',
    }),
  content: Joi.string()
    .min(1)
    .messages({
      'string.min': 'Content cannot be empty',
    }),
  excerpt: Joi.string()
    .max(500)
    .allow('', null),
  coverImage: Joi.string()
    .allow('', null)
    .custom((value, helpers) => {
      // Allow empty string or null
      if (!value || value === '') {
        return value;
      }
      // Allow relative paths (starting with /)
      if (value.startsWith('/')) {
        return value;
      }
      // Validate as URI for absolute URLs
      try {
        new URL(value);
        return value;
      } catch {
        return helpers.error('string.uri');
      }
    }),
  category: Joi.string()
    .uuid()
    .allow(null, ''),
  tags: Joi.array()
    .items(Joi.string().max(30))
    .max(10),
  status: Joi.string()
    .valid('draft', 'published'),
});

export const autoSaveBlogSchema = Joi.object({
  title: Joi.string()
    .max(200)
    .allow(''),
  content: Joi.string()
    .allow(''),
  excerpt: Joi.string()
    .max(500)
    .allow('', null),
  coverImage: Joi.string()
    .allow('', null)
    .custom((value, helpers) => {
      // Allow empty string or null
      if (!value || value === '') {
        return value;
      }
      // Allow relative paths (starting with /)
      if (value.startsWith('/')) {
        return value;
      }
      // Validate as URI for absolute URLs
      try {
        new URL(value);
        return value;
      } catch {
        return helpers.error('string.uri');
      }
    }),
  category: Joi.string()
    .uuid()
    .allow(null, ''),
  tags: Joi.array()
    .items(Joi.string().max(30))
    .max(10),
});

export const blogQuerySchema = Joi.object({
  page: Joi.number()
    .integer()
    .min(1)
    .default(1),
  limit: Joi.number()
    .integer()
    .min(1)
    .max(100)
    .default(10),
  category: Joi.string()
    .uuid()
    .allow(''),
  tag: Joi.string()
    .max(30)
    .allow(''),
  author: Joi.string()
    .uuid()
    .allow(''),
  search: Joi.string()
    .max(100)
    .allow(''),
  status: Joi.string()
    .valid('draft', 'published')
    .allow(''),
});
