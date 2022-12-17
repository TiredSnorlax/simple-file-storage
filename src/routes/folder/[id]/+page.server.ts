import { getPermissions } from '$lib/database/helper';
import type { IDoc, IFolderFilled } from '$lib/types';
import { domain } from '$lib/utils';
import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies, params }) => {
	const userId = cookies.get('session');

	// TODO add checks for permissions
	if (!userId) throw redirect(302, '/login');

	const { id } = params;

	const userPermission = await getPermissions(cookies.get('session'), 'folder', id);

	if (!userPermission) throw error(403, 'Not authorized');

	try {
		const res = await fetch(domain + 'api/document/child', {
			method: 'post',
			body: JSON.stringify({ childId: id, type: 'folder' })
		});

		const doc = (await res.json()) as IDoc;

		const folderRes = await fetch(domain + 'api/folder/' + id, {
			method: 'get'
		});

		console.log(folderRes);

		const folder = (await folderRes.json()) as IFolderFilled;

		const data = { userPermission, doc, folder };
		return data;
	} catch (err) {
		console.log(err);
		throw error(400, 'Error when retrieving file');
	}
};
