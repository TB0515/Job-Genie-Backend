const isProd = process.env.NODE_ENV === 'production';

export const cookieOptions = {
	httpOnly: true,
	secure: isProd,
	sameSite: 'lax' as const,
	path: '/',
};
