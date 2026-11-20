// Get the bare domain from a website URL, e.g. "https://www.stripe.com/uk" -> "stripe.com"
export function extractDomain(websiteUrl: string): string {
	try {
		const url = new URL(websiteUrl);
		return url.hostname.replace('www.', '');
	} catch {
		return websiteUrl.replace(/https?:\/\/(www\.)?/, '').split('/')[0];
	}
}

// True only for real http:// or https:// links (rejects "javascript:", "data:", plain text, etc.)
export function isHttpUrl(value: string): boolean {
	try {
		const url = new URL(value);
		return url.protocol === 'http:' || url.protocol === 'https:';
	} catch {
		return false;
	}
}

// Company logo from Google's favicon service, based on the company's website
export function logoFromWebsite(websiteUrl: string): string {
	const domain = encodeURIComponent(extractDomain(websiteUrl));
	return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
}
