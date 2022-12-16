import { setupDb } from '$lib/database/db';
import { getDocsFromId } from '$lib/database/helper';
import type { IDoc } from '$lib/types';
import { error } from '@sveltejs/kit';
import { ObjectId } from 'mongodb';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	const { db } = await setupDb();
	const { userId } = await request.json();

	const users = db.collection('users');
	const documents = db.collection<IDoc>('documents');

	try {
		const user = await users.findOne({ _id: new ObjectId(userId) });
		if (!user) throw error(400, 'No such folder.');
		const children = await getDocsFromId(user.mainFolder, documents);
		const re = { ...user };
		re.mainFolder = children;
		return new Response(JSON.stringify(re));
	} catch (_) {
		throw error(400, 'Something went wrong');
	}
};
