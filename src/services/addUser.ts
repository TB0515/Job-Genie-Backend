import { SupabaseClient } from '@supabase/supabase-js';
import { supabaseAdmin } from '../config/supabaseAdmin.js';

type addUserObject = {
	auth_user_id: string;
	username: string;
	email: string;
	first_name: string;
	last_name: string;
	phone: string;
	loc_postcode?: string;
	loc_country?: string;
	search_radius?: number;
};

export async function addUser(
	newUser: addUserObject,
	client: SupabaseClient = supabaseAdmin
) {
	const { data, error } = await client
		.from('Users')
		.upsert(newUser, { onConflict: 'auth_user_id' })
		.select();

	if (error) {
		throw new Error(error.message);
	}

	return data;
}
