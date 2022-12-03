import { setupUsers } from '$lib/database/db';
import type { IUser } from '$lib/types';
import { error } from '@sveltejs/kit';
import { ObjectId } from 'mongodb';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	const { users } = await setupUsers();
	const { userId } = await request.json();

	try {
		const user = await users.findOne<IUser>({ _id: new ObjectId(userId) });
		return new Response(JSON.stringify(user));
	} catch (_) {
		throw error(400, 'Something went wrong');
	}
};
