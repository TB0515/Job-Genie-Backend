import { rateLimit } from 'express-rate-limit';
import { AuthenticatedRequest } from '../types/auth.js';

const TEN_MINUTES = 10 * 60 * 1000;

// Keyed by user id, not IP: behind Render's rewrite every request has the proxy's IP
const byUserId = (req: AuthenticatedRequest) => req.user!.id;

const tooManyRequests = {
	success: false,
	message: 'Too many requests, please try again later.',
};

export const generateLimiter = rateLimit({
	windowMs: TEN_MINUTES,
	limit: 5,
	keyGenerator: byUserId,
	message: tooManyRequests,
	standardHeaders: 'draft-7',
	legacyHeaders: false,
	validate: { xForwardedForHeader: false },
});

export const jobsLimiter = rateLimit({
	windowMs: TEN_MINUTES,
	limit: 10,
	keyGenerator: byUserId,
	message: tooManyRequests,
	standardHeaders: 'draft-7',
	legacyHeaders: false,
	validate: { xForwardedForHeader: false },
});
