import { SupabaseClient } from '@supabase/supabase-js';
import { supabaseAdmin } from '../config/supabaseAdmin.js';

export async function deleteUser(
	username: string,
	client: SupabaseClient = supabaseAdmin
) {
	const { data, error } = await client
		.from('Users')
		.delete()
		.eq('username', username)
		.select();

	if (error) {
		throw new Error(error.message);
	}

	return data;
}
