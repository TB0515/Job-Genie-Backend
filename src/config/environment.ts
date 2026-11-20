import dotenv from 'dotenv';

dotenv.config();

const theirStackTokenValue = process.env.THEIRSTACK_TOKEN;
const anthropicApiKeyValue = process.env.ANTHROPIC_API_KEY;
const googleClientIdValue = process.env.GOOGLE_CLIENT_ID;

if (!theirStackTokenValue || !anthropicApiKeyValue || !googleClientIdValue) {
	throw new Error(
		'Missing required environment variables: THEIRSTACK_TOKEN, ANTHROPIC_API_KEY, GOOGLE_CLIENT_ID'
	);
}

export const theirStackToken: string = theirStackTokenValue;
export const anthropicApiKey: string = anthropicApiKeyValue;
export const googleClientId: string = googleClientIdValue;

export const config = {
	port: process.env.PORT || 3000,
	nodeEnv: process.env.NODE_ENV || 'development',
	corsOrigin: (process.env.CORS_ORIGIN || 'http://localhost:5173').split(','),
	// Add more config as needed
};
