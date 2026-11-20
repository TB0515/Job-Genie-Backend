import { Request } from 'express';

export interface AuthUser {
	id: string;
	email: string;
	given_name: string;
	name: string;
	phone: string | null;
	username: string;
}

export interface AuthenticatedRequest extends Request {
	user?: AuthUser;
}
