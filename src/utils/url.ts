export function extractDomain(websiteUrl: string): string {
	try {
		const url = new URL(websiteUrl);
		return url.hostname.replace('www.', '');
	} catch {
		return websiteUrl.replace(/https?:\/\/(www\.)?/, '').split('/')[0];
	}
}

export function isHttpUrl(value: string): boolean {
	try {
		const url = new URL(value);
		return url.protocol === 'http:' || url.protocol === 'https:';
	} catch {
		return false;
	}
}

export function logoFromWebsite(websiteUrl: string): string {
	const domain = encodeURIComponent(extractDomain(websiteUrl));
	return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
}
