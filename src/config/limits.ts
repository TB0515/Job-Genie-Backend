// Shared limits so /generate and /jobs always agree

// Most companies /generate returns and /jobs accepts per request
export const MAX_COMPANIES = 5;

// Oldest job posting (in days) /jobs will search for; the frontend uses 7
export const MAX_POSTED_AT_DAYS = 7;
