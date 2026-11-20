import { rateLimit } from 'express-rate-limit';
import { AuthenticatedRequest } from '../types/auth.js';

const TEN_MINUTES = 10 * 60 * 1000;

// Limits are counted per logged-in user, not per IP: behind Render's rewrite
// every request arrives from the proxy's IP. These limiters run after requireAuth.
const byUserId = (req: AuthenticatedRequest) => req.user!.id;

const tooManyRequests = {
	success: false,
	message: 'Too many requests, please try again later.',
};

// Each /generate call is a Claude request plus DB writes
export const generateLimiter = rateLimit({
	windowMs: TEN_MINUTES,
	limit: 5,
	keyGenerator: byUserId,
	message: tooManyRequests,
	standardHeaders: 'draft-7',
	legacyHeaders: false,
	// We don't key by IP, so the X-Forwarded-For proxy warning doesn't apply
	validate: { xForwardedForHeader: false },
});

// Each /jobs call is one TheirStack request per company
export const jobsLimiter = rateLimit({
	windowMs: TEN_MINUTES,
	limit: 10,
	keyGenerator: byUserId,
	message: tooManyRequests,
	standardHeaders: 'draft-7',
	legacyHeaders: false,
	validate: { xForwardedForHeader: false },
});
