import type { RequestHandler } from './$types';
import { setupFiles } from '$lib/database/db';
import { error } from '@sveltejs/kit';
import { Readable } from 'stream';
import { ObjectId } from 'mongodb';

export const POST: RequestHandler = async ({ request }) => {
	// const client = await clientPromise;
	// const db = client.db('files');
	// const bucket = new mongodb.GridFSBucket(db, { bucketName: 'myCustomBucket' });

	const { bucket } = await setupFiles();

	try {
		// const data = await request.formData();
		const data = await request.json();

		// console.log(buffer.data);

		// const file = data.get('file') as Blob;
		// const fileName = data.get('fileName') as string;

		// const arrayBuffer = await file.arrayBuffer();

		// const buffer = Buffer.from(arrayBuffer);

		console.time('converToBuffer')

		const buffer = Buffer.from(data.buffer);
		console.log(buffer);

		const fileName = data.filename;

		const readable = Readable.from(buffer);

		readable.pipe(bucket.openUploadStream(fileName));

		readable.on('end', () => console.timeEnd('converToBuffer'))

		return new Response('done');
	} catch (err) {
		console.log(err);
		throw error(400, 'Something went wrong');
	}
};

export const DELETE: RequestHandler = async ({ request }) => {
	const { bucket } = await setupFiles();
	const { id } = await request.json();
	console.log(id);

	await bucket.delete(new ObjectId(id));

	return new Response(id + ' deleted');
};
