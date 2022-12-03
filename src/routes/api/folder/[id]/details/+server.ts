import { setupFiles } from '$lib/database/db';
import { getFolderDetails } from '$lib/database/helper';
import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ params }) => {
	const { bucket, db } = await setupFiles();
	const { id } = params;

	try {
		const data = await getFolderDetails(db, bucket, id);
		return new Response(JSON.stringify(data));
	} catch (err) {
        console.log(err)
		throw error(400, 'Something went wrong when retrieving details');
	}
};
