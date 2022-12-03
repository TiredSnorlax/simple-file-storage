import { setupDocuments } from '$lib/database/db';
import { error } from '@sveltejs/kit';
import { ObjectId } from 'mongodb';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	const { docs } = await setupDocuments();
	const { childId, type } = await request.json();
	try {
		const doc = await docs.findOne({ type,  childId: new ObjectId(childId) });
		return new Response(JSON.stringify(doc));
	} catch (err) {
		throw error(400, 'No such doc');
	}
};
