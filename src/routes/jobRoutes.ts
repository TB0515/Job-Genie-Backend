import { Router } from 'express';
import { getJobsForWishlist } from '../controllers/jobsController.js';
import { jobsLimiter } from '../middleware/rateLimits.js';

const router = Router();

router.post('/', jobsLimiter, getJobsForWishlist);

export default router;
