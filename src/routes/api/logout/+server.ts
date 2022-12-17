import type { RequestHandler } from './$types';
import { error } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ cookies }) => {
	try {
		cookies.delete('session', { path: '/' });
		console.log('delete cookie');
		return new Response(JSON.stringify({ message: 'Logout successful', success: true }));
	} catch (err) {
		console.log(err);
		throw error(400, 'Error when logging out');
	}
};
