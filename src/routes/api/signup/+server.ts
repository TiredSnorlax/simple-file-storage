import type { RequestHandler } from './$types';
import { setupUsers } from '$lib/database/db';
import { error } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
	const { username, password } = await request.json();

	const _user = {
		username,
		password,
		mainFolder: []
	};

	const { users } = await setupUsers();
	const exists = await users.findOne({ username });
	if (exists) throw error(400, 'User already exists');
	try {
		const newUser = await users.insertOne(_user);
		return new Response(JSON.stringify(newUser));
	} catch (err) {
		console.log(err);
		throw error(400, 'Error happened when creating user');
	}
};
