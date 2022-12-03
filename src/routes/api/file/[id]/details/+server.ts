import { setupFiles } from '$lib/database/db';
import { getFileDetails } from '$lib/database/helper';
import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ params }) => {
	const { bucket } = await setupFiles();
	const { id } = params;

	try {
		const file = await getFileDetails(bucket, id);
		return new Response(JSON.stringify(file));
	} catch (err) {
		console.log(err);
		throw error(400, 'Something went wrong when retrieving details');
	}
};
