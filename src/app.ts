import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import signinRoutes from './routes/routesSignin.js';
import wishlistRouter from './routes/wishlist.route.js';
import jobRoutes from './routes/jobRoutes.js';
import { requireAuth } from './middleware/requireAuth.js';
import { checkOrigin } from './middleware/checkOrigin.js';
import { config } from './config/environment.js';

const app: Application = express();

// Middleware
app.use(
	cors({
		origin: config.corsOrigin,
		credentials: true, // allow cookies / auth headers
	})
);
app.use(checkOrigin);
app.use(cookieParser());
app.use(express.json({ limit: '10kb' }));

// API routing
app.use('/auth', signinRoutes);
app.use('/api/wishlist', requireAuth, wishlistRouter);
app.use('/jobs', requireAuth, jobRoutes);

// Basic health check route
app.get('/health', (req: Request, res: Response) => {
	res
		.status(200)
		.json({ status: 'ok', message: 'Job Genie Backend is running' });
});

// Root route
app.get('/', (req: Request, res: Response) => {
	res.json({ message: 'Welcome to Job Genie API' });
});

// 404 handler
app.use((req: Request, res: Response) => {
	res.status(404).json({ error: 'Route not found' });
});

// Error handling middleware
app.use(
	(
		err: Error & { status?: number },
		req: Request,
		res: Response,
		next: NextFunction
	) => {
		if (err.status === 413) {
			res.status(413).json({ success: false, error: 'Request too large' });
			return;
		}
		if (err.status && err.status < 500) {
			res.status(err.status).json({ success: false, error: 'Invalid request' });
			return;
		}
		console.error(err.stack);
		res.status(500).json({ success: false, error: 'Something went wrong!' });
	}
);

export default app;
