import { setupUsers } from '$lib/database/db';
import type { IUser } from '$lib/types';
import { error } from '@sveltejs/kit';
import type { WithId } from 'mongodb';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	const { users } = await setupUsers();
	const { userQuery }: { userQuery: string } = await request.json();

	const reg = new RegExp(
		userQuery[0] === '@' ? '^' + userQuery.substring(1) : '^' + userQuery,
		'i'
	);
	console.log(reg);

	let results: WithId<IUser>[];
	try {
		if (userQuery[0] === '@') results = await users.find({ username: reg }).limit(10).toArray();
		else results = await users.find({ email: reg }).limit(10).toArray();
		console.log(results);
		return new Response(JSON.stringify(results));
	} catch (err) {
		console.log(err);
		throw error(400, 'Bad search request');
	}
};
