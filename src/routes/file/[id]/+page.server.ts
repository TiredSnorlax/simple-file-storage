import { getPermissions } from '$lib/database/helper';
import type { IDoc } from '$lib/types';
import { domain } from '$lib/utils';
import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies, params }) => {
	const userId = cookies.get('session');

	if (!userId) throw redirect(302, '/login');

	const { id } = params;

	const userPermission = await getPermissions(cookies.get('session'), 'file', id);
	console.log(userPermission);

	if (!userPermission) throw error(403, 'Not authorized');

	try {
		const res = await fetch(domain + 'api/document/child', {
			method: 'post',
			body: JSON.stringify({ childId: id, type: 'file' })
		});

		const doc = (await res.json()) as IDoc;
		const data = { userPermission, doc };
		return data;
	} catch (err) {
		console.log(err);
		throw error(400, 'Error when retrieving file');
	}
};
