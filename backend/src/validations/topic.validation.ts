/**
 * Topic Validation Schemas
 */

import Joi from 'joi';

export const createTopicSchema = Joi.object({
  title: Joi.string()
    .min(1)
    .max(150)
    .required()
    .messages({
      'string.min': 'Topic title is required',
      'string.max': 'Title cannot exceed 150 characters',
      'any.required': 'Topic title is required',
    }),
  description: Joi.string()
    .max(500)
    .allow('', null)
    .messages({
      'string.max': 'Description cannot exceed 500 characters',
    }),
  category: Joi.string()
    .uuid()
    .required()
    .messages({
      'string.guid': 'Category must be a valid ID',
      'any.required': 'Category is required',
    }),
  difficulty: Joi.string()
    .valid('beginner', 'intermediate', 'advanced')
    .default('intermediate')
    .messages({
      'any.only': 'Difficulty must be beginner, intermediate, or advanced',
    }),
  suggestedTags: Joi.array()
    .items(Joi.string().max(30))
    .max(10)
    .messages({
      'array.max': 'Maximum 10 suggested tags allowed',
    }),
});

export const updateTopicSchema = Joi.object({
  title: Joi.string()
    .min(1)
    .max(150)
    .messages({
      'string.min': 'Topic title cannot be empty',
      'string.max': 'Title cannot exceed 150 characters',
    }),
  description: Joi.string()
    .max(500)
    .allow('', null),
  category: Joi.string()
    .uuid(),
  difficulty: Joi.string()
    .valid('beginner', 'intermediate', 'advanced'),
  suggestedTags: Joi.array()
    .items(Joi.string().max(30))
    .max(10),
  isActive: Joi.boolean(),
});

export const topicQuerySchema = Joi.object({
  category: Joi.string()
    .uuid()
    .allow(''),
  difficulty: Joi.string()
    .valid('beginner', 'intermediate', 'advanced')
    .allow(''),
  search: Joi.string()
    .max(100)
    .allow(''),
});
