import { setupDocuments } from '$lib/database/db';
import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	const { docs } = await setupDocuments();
	const { term, filter } = await request.json();

	const reg = new RegExp(term, 'i');
	console.log(reg);
	try {
		const results = await docs
			.find({ name: reg, fileType: { $in: filter } })
			.limit(10)
			.toArray();
		console.log(results);
		return new Response(JSON.stringify(results));
	} catch (err) {
		console.log(err);
		throw error(400, 'Bad search request');
	}
};
