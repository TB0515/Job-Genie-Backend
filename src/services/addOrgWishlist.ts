import { supabase } from '../config/supabase.js';

export async function addOrg(
	name: string,
	city: string,
	country: string,
	industry: string,
	description: string,
	size: string,
	img_url?: string
) {
	const { data, error } = await supabase
		.from('Wishlist')
		.insert({
			name: name,
			city: city,
			country: country,
			industry: industry,
			description: description,
			size: size,
			img_url: img_url,
		})
		.select();

	if (error) {
		if (error.code === '23505') {
			const { data: existing, error: findError } = await supabase
				.from('Wishlist')
				.select()
				.eq('name', name)
				.eq('city', city);

			if (findError) throw new Error(findError.message);
			return existing;
		}
		throw new Error(error.message);
	}

	return data;
}
