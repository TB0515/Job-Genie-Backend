import { SupabaseClient } from '@supabase/supabase-js';
import { supabaseAdmin } from '../config/supabaseAdmin.js';

export async function getOrgsByUser(
	userID: number,
	client: SupabaseClient = supabaseAdmin
) {
	const { data, error } = await client
		.from('User-Wishlist')
		.select('user_fk, wishlist_fk')
		.eq('user_fk', userID);

	if (error) {
		throw new Error(error.message);
	}

	return data;
}
