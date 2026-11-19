import { SupabaseClient } from '@supabase/supabase-js';
import { supabaseAdmin } from '../config/supabaseAdmin.js';

export async function deleteRelationshipUserOrg(
	userID: number,
	organisationIDs: Array<number>,
	client: SupabaseClient = supabaseAdmin
) {
	const { error } = await client
		.from('User-Wishlist')
		.delete()
		.eq('user_fk', userID)
		.in('wishlist_fk', organisationIDs);

	if (error) {
		throw new Error(error.message);
	}

	return { success: true, deletedCount: organisationIDs.length };
}
