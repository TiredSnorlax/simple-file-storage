import { setupFiles } from '$lib/database/db';
import { error } from '@sveltejs/kit';
import { ObjectId } from 'mongodb';
import { Readable } from 'stream';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params }) => {
	const { bucket } = await setupFiles();

	const { id } = params;

	try {
		const preview = await bucket.find({ 'metadata.original': new ObjectId(id) }).toArray();
		if (!preview || preview.length === 0) throw error(400, 'No preview');
		const stream = bucket.openDownloadStream(new ObjectId(preview[0]._id));
		return new Response(
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			stream,
			{
				headers: {
					'cache-control': 'no-cache',
					'content-type': 'text/event-stream'
				}
			}
		);
	} catch (err) {
		console.log(err);
		throw error(400, 'Something went wrong when retrieving file');
	}
};

export const POST: RequestHandler = async ({ request, params }) => {
	const { bucket } = await setupFiles();
	const { buffer, filename } = await request.json();

	// * id of original file
	const { id } = params;

	try {
		const _buffer = Buffer.from(buffer);
		const readable = Readable.from(_buffer);
		const uploadStream = bucket.openUploadStream('preview-' + filename, {
			chunkSizeBytes: 1048576,
			metadata: {
				original: new ObjectId(id)
			}
		});
		readable.pipe(uploadStream);
		await new Promise((resolve) =>
			uploadStream.on('close', () => {
				return resolve('done');
			})
		);

		return new Response('Preview added successfully');
	} catch (err) {
		console.log(err);
		throw error(400, 'Something went wrong');
	}
};
