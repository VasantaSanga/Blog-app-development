/**
 * Topic Routes
 */

import { Router } from 'express';
import {
  getTopics,
  getTopic,
  getRandomTopics,
  createTopic,
  updateTopic,
  deleteTopic,
} from '../controllers/topic.controller.js';
import { authGuard, adminGuard } from '../middleware/authGuard.js';
import { validateBody, validateQuery } from '../middleware/validate.js';
import {
  createTopicSchema,
  updateTopicSchema,
  topicQuerySchema,
} from '../validations/topic.validation.js';

const router = Router();

// Public routes (specific routes before parameterized)
router.get('/', validateQuery(topicQuerySchema), getTopics);
router.get('/random', getRandomTopics);
router.get('/:id', getTopic);

// Admin only routes
router.post('/', authGuard, adminGuard, validateBody(createTopicSchema), createTopic);
router.put('/:id', authGuard, adminGuard, validateBody(updateTopicSchema), updateTopic);
router.delete('/:id', authGuard, adminGuard, deleteTopic);

export default router;
