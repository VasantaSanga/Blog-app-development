/**
 * Routes Index
 */

import { Router } from 'express';
import authRoutes from './auth.routes.js';
import blogRoutes from './blog.routes.js';
import categoryRoutes from './category.routes.js';
import topicRoutes from './topic.routes.js';
import commentRoutes from './comment.routes.js';
import uploadRoutes from './upload.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/blogs', blogRoutes);
router.use('/categories', categoryRoutes);
router.use('/topics', topicRoutes);
router.use('/comments', commentRoutes);
router.use('/upload', uploadRoutes);

export default router;
