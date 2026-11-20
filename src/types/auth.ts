import { Request } from 'express';

// The logged-in user, attached to the request by the requireAuth middleware
export interface AuthUser {
	id: string; // Supabase auth UUID
	email: string;
	given_name: string;
	name: string;
	phone: string | null;
	username: string;
}

// A request that has passed through requireAuth
export interface AuthenticatedRequest extends Request {
	user?: AuthUser;
}
