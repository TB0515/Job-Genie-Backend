import { Request, Response, NextFunction } from 'express';
import { config } from '../config/environment.js';

const SAFE_METHODS = ['GET', 'HEAD', 'OPTIONS'];

export const checkOrigin = (
	req: Request,
	res: Response,
	next: NextFunction
): void => {
	if (SAFE_METHODS.includes(req.method)) {
		next();
		return;
	}

	const origin = req.get('Origin');
	if (!origin || config.corsOrigin.includes(origin)) {
		next();
		return;
	}

	console.warn(`Blocked ${req.method} ${req.path} from origin: ${origin}`);
	res.status(403).json({ success: false, message: 'Forbidden' });
};
