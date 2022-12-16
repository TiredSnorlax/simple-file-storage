import type { RequestHandler } from './$types';
import { setupUsers } from '$lib/database/db';
import { error } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request, cookies }) => {
	const { username, password } = await request.json();

	const { users } = await setupUsers();

	try {
		const found = await users.findOne({ username, password });
		if (!found) throw error(400, 'Username or password incorrect');
		console.log(found._id.toString());

		cookies.set('session', found._id.toString(), {
			path: '/',
			// server side only cookie so you can't use `document.cookie`
			httpOnly: true,
			// only requests from same site can send cookies
			// https://developer.mozilla.org/en-US/docs/Glossary/CSRF
			sameSite: 'strict',
			// only sent over HTTPS in production
			secure: process.env.NODE_ENV === 'production',
			// set cookie to expire after a month
			maxAge: 60 * 60 * 24 * 30
		});

		return new Response(JSON.stringify({ message: 'Logged in successfully', found }));
	} catch (err) {
		console.log(err);
		throw error(400, 'Something went wrong');
	}
};
