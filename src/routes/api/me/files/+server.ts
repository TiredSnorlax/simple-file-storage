import { setupDb } from '$lib/database/db';
import { getDocsFromId } from '$lib/database/helper';
import type { IUser, IDoc } from '$lib/types';
import { error } from '@sveltejs/kit';
import { ObjectId } from 'mongodb';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ cookies, request }) => {
	const { db } = await setupDb();
	let userId;

	if (cookies.get('session')) userId = cookies.get('session');
	else {
		const temp = await request.json();
		if (temp.userId) userId = temp.userId;
	}

	const users = db.collection<IUser>('users');
	const documents = db.collection<IDoc>('documents');

	try {
		const user = await users.findOne({ _id: new ObjectId(userId) });
		if (!user) throw error(400, 'User not found');
		const files = await getDocsFromId(user.mainFolder, documents);
		return new Response(JSON.stringify({ files }));
	} catch (err) {
		console.log(err);
		throw error(400, 'Something went wrong when retrieving files');
	}
};
