/**
 * AI Routes
 * Routes for AI-powered content generation
 */

import { Router } from 'express';
import { generateContent, getStatus } from '../controllers/ai.controller.js';
import { authGuard } from '../middleware/authGuard.js';
import { validate } from '../middleware/validate.js';
import { generateContentSchema } from '../validations/ai.validation.js';

const router = Router();

// Check AI service status (public)
router.get('/status', getStatus);

// Generate blog content (requires auth)
router.post('/generate', authGuard, validate(generateContentSchema), generateContent);

export default router;
