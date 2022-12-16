import { setupDb } from '$lib/database/db';
import { error } from '@sveltejs/kit';
import { ObjectId } from 'mongodb';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ cookies }) => {
	const { db } = await setupDb();

	const userId = cookies.get('session');

	const users = db.collection('users');

	try {
		const user = await users.findOne({ _id: new ObjectId(userId) });
		if (!user) throw error(400, 'No such folder.');
		return new Response(JSON.stringify(user));
	} catch (_) {
		throw error(400, 'Something went wrong');
	}
};
