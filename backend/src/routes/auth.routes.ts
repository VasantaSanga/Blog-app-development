/**
 * Auth Routes
 */

import { Router } from 'express';
import {
  register,
  login,
  getMe,
  updateProfile,
  changePassword,
} from '../controllers/auth.controller.js';
import { authGuard } from '../middleware/authGuard.js';
import { validateBody } from '../middleware/validate.js';
import {
  registerSchema,
  loginSchema,
  updateProfileSchema,
  changePasswordSchema,
} from '../validations/auth.validation.js';

const router = Router();

// Public routes
router.post('/register', validateBody(registerSchema), register);
router.post('/login', validateBody(loginSchema), login);

// Protected routes
router.get('/me', authGuard, getMe);
router.put('/profile', authGuard, validateBody(updateProfileSchema), updateProfile);
router.put('/password', authGuard, validateBody(changePasswordSchema), changePassword);

export default router;
