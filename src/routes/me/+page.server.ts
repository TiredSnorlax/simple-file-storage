import { domain } from '$lib/utils';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
export const load: PageServerLoad = async ({ cookies }) => {
	const res = await fetch(domain + 'api/me/files', {
		method: 'post',
		body: JSON.stringify({ userId: cookies.get('session') })
	});
	const data = await res.json();
	if (data) {
		return data;
	}
	throw error(404, 'Not found');
};
