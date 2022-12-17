import { domain } from '$lib/utils';
import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
export const load: PageServerLoad = async ({ cookies }) => {
	const userId = cookies.get('session');

	if (!userId) throw redirect(302, '/login');

	try {
		const res = await fetch(domain + 'api/me/files', {
			method: 'post',
			body: JSON.stringify({ userId: cookies.get('session') })
		});
		const data = await res.json();

		return data;
	} catch (err) {
		console.log(err);
		throw error(400, 'Error when retrieving folder');
	}
};
