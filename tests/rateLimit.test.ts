import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';
import type { Response, NextFunction } from 'express';
import type { AuthenticatedRequest } from '../src/types/auth.js';
import app from '../src/app.js';

vi.mock('../src/middleware/requireAuth.js', () => ({
	requireAuth: (
		req: AuthenticatedRequest,
		_res: Response,
		next: NextFunction
	) => {
		req.user = {
			id: 'rate-limit-user',
			email: 'test@test.com',
			given_name: 'Test',
			name: 'Test User',
			phone: null,
			username: 'test@test.com',
		};
		next();
	},
}));

vi.mock('../src/services/theirStack.js', () => ({
	fetchTheirStackJobs: vi.fn().mockResolvedValue([]),
}));

vi.mock('../src/config/supabase.js', () => ({ supabase: {} }));
vi.mock('../src/config/supabaseAdmin.js', () => ({ supabaseAdmin: {} }));

describe('Rate limits', () => {
	it('POST /jobs returns 429 after 10 requests in 10 minutes', async () => {
		const body = { companies: [{ name: 'TestCo' }] };

		for (let i = 0; i < 10; i++) {
			await request(app).post('/jobs').send(body).expect(200);
		}

		const res = await request(app).post('/jobs').send(body).expect(429);
		expect(res.body.success).toBe(false);
	});
});
