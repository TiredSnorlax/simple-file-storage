import type { RequestHandler } from './$types';
import { setupUsers } from '$lib/database/db';

export const POST: RequestHandler = async ({ request }) => {
	const { users } = await setupUsers();

	const { username } = await request.json();

	const exists = await users.findOne({ username: username });

	return new Response(JSON.stringify(exists));
};
