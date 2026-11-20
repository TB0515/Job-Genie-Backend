// backend/tests/server.test.ts

import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';
import { config } from '../src/config/environment.js';

/**
 * Basic server integration tests
 * TODO: Add more comprehensive tests as the application grows
 */

describe('Server Health Check', () => {
	it('should return 200 OK on /health endpoint', async () => {
		const response = await request(app).get('/health');

		expect(response.status).toBe(200);
		expect(response.body).toHaveProperty('status', 'ok');
	});

	it('sends security headers and hides X-Powered-By', async () => {
		const response = await request(app).get('/health');

		expect(response.headers['x-content-type-options']).toBe('nosniff');
		expect(response.headers['x-powered-by']).toBeUndefined();
	});

	it('should return welcome message on root endpoint', async () => {
		const response = await request(app).get('/');

		expect(response.status).toBe(200);
		expect(response.body).toHaveProperty('message');
	});
});

describe('404 Handler', () => {
	it('should return 404 for unknown routes', async () => {
		const response = await request(app).get('/api/unknown-route');

		expect(response.status).toBe(404);
		expect(response.body).toHaveProperty('error');
	});
});

describe('Origin check', () => {
	it('blocks POST requests from other websites with 403', async () => {
		const response = await request(app)
			.post('/auth/logout')
			.set('Origin', 'https://evil.example')
			.expect(403);

		expect(response.body.success).toBe(false);
	});

	it('lets POST requests from the frontend origin through', async () => {
		await request(app)
			.post('/api/unknown-route')
			.set('Origin', config.corsOrigin[0])
			.expect(404);
	});
});

describe('Error handler', () => {
	it('returns 400 for malformed JSON', async () => {
		const response = await request(app)
			.post('/api/unknown-route')
			.set('Content-Type', 'application/json')
			.send('{bad json')
			.expect(400);

		expect(response.body.error).toBe('Invalid request');
	});

	it('returns 413 for a body over 10kb', async () => {
		const response = await request(app)
			.post('/api/unknown-route')
			.send({ text: 'a'.repeat(11 * 1024) })
			.expect(413);

		expect(response.body.error).toBe('Request too large');
	});
});
