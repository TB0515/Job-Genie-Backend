import { Response } from 'express';
import { AuthenticatedRequest } from '../types/auth.js';
import { fetchTheirStackJobs, TheirStackJob } from '../services/theirStack.js';
import { Company } from '../data/companies.js';
import { getOrgsByUser } from '../services/getOrgsByUser.js';
import { supabaseAdmin } from '../config/supabaseAdmin.js';
import { MAX_COMPANIES, MAX_POSTED_AT_DAYS } from '../config/limits.js';
import { JOB_COUNTRY_CODES } from '../config/externalApis.js';

interface CompanyName {
	name: string;
}

interface JobsByWishlistRequestBody {
	postedAt?: number;
	companies?: CompanyName[];
	jobTitles?: string[];
	remote?: boolean | null;
}

interface JobsByWishlistResult {
	company: string;
	jobs: TheirStackJob[];
}

function validateJobsRequest(body: JobsByWishlistRequestBody): string | null {
	const { companies, postedAt, jobTitles } = body;

	if (companies !== undefined) {
		if (!Array.isArray(companies)) {
			return 'companies must be a list';
		}
		if (companies.length > MAX_COMPANIES) {
			return `You can search jobs for at most ${MAX_COMPANIES} companies at a time`;
		}
		const everyCompanyHasName = companies.every(
			(company) =>
				typeof company?.name === 'string' && company.name.trim() !== ''
		);
		if (!everyCompanyHasName) {
			return 'Each company needs a name';
		}
	}

	if (postedAt !== undefined) {
		const isValidDays =
			Number.isInteger(postedAt) &&
			postedAt >= 1 &&
			postedAt <= MAX_POSTED_AT_DAYS;
		if (!isValidDays) {
			return `postedAt must be a whole number of days from 1 to ${MAX_POSTED_AT_DAYS}`;
		}
	}

	if (jobTitles !== undefined) {
		const isListOfStrings =
			Array.isArray(jobTitles) &&
			jobTitles.every((title) => typeof title === 'string');
		if (!isListOfStrings) {
			return 'jobTitles must be a list of strings';
		}
	}

	return null;
}

async function getCompaniesFromDB(authUuid: string): Promise<Company[]> {
	const { data: userRow, error: userError } = await supabaseAdmin
		.from('Users')
		.select('id')
		.eq('auth_user_id', authUuid)
		.single();

	if (userError || !userRow) return [];

	const relationships = await getOrgsByUser(userRow.id as number);
	if (!relationships || relationships.length === 0) return [];

	const orgIds = relationships.map((r) => r.wishlist_fk);
	const { data: orgs, error: orgsError } = await supabaseAdmin
		.from('Wishlist')
		.select('*')
		.in('id', orgIds);

	if (orgsError || !orgs) return [];

	return orgs as Company[];
}

export const getJobsForWishlist = async (
	req: AuthenticatedRequest,
	res: Response
) => {
	try {
		const body: JobsByWishlistRequestBody = req.body ?? {};

		const validationError = validateJobsRequest(body);
		if (validationError) {
			return res.status(400).json({ success: false, message: validationError });
		}

		const {
			postedAt = MAX_POSTED_AT_DAYS,
			companies,
			jobTitles = ['software engineer', 'developer'],
		} = body;

		// Use explicit companies if provided, otherwise fall back to user's DB wishlist
		const sourceCompanies: CompanyName[] =
			companies && companies.length > 0
				? companies
				: (await getCompaniesFromDB(req.user!.id)).slice(0, MAX_COMPANIES);

		if (!sourceCompanies || sourceCompanies.length === 0) {
			return res.status(400).json({
				success: false,
				message: 'No companies available in wishlist',
			});
		}

		const results: JobsByWishlistResult[] = await Promise.all(
			sourceCompanies.map(async (company) => {
				const jobs = await fetchTheirStackJobs(
					0,
					5,
					postedAt,
					company.name,
					jobTitles,
					JOB_COUNTRY_CODES
				);

				if (jobs.length > 0) {
					await supabaseAdmin
						.from('Wishlist')
						.update({ jobs })
						.eq('name', company.name);
				}

				return {
					company: company.name,
					jobs,
				};
			})
		);

		return res.status(200).json({
			success: true,
			results,
		});
	} catch (error) {
		console.error('Error fetching jobs for wishlist:', error);
		return res.status(500).json({
			success: false,
			message: 'Failed to fetch jobs for wishlist',
		});
	}
};
