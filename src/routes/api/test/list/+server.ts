import { setupFiles } from '$lib/database/db';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	const { bucket } = await setupFiles();

	const files = await bucket.find({}).toArray();

	return new Response(JSON.stringify(files));
};
