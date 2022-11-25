import type { RequestHandler } from './$types';
import { setupFiles } from '$lib/database/db';

export const GET: RequestHandler = async ({ params }) => {
	const { bucket } = await setupFiles();
	const { filename } = params;
	const stream = bucket.openDownloadStreamByName(filename);

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
	return new Response(stream, {
		headers: {
			'cache-control': 'no-cache',
			'content-type': 'text/event-stream'
		}
	});
};
