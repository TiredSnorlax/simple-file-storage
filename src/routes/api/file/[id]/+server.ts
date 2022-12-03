import { setupFiles } from '$lib/database/db';
import { deleteFile } from '$lib/database/helper';
import { error } from '@sveltejs/kit';
import { ObjectId } from 'mongodb';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params }) => {
	const { bucket } = await setupFiles();

	const { id } = params;

	try {
		const stream = bucket.openDownloadStream(new ObjectId(id));
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
		throw error(400, 'Something went wrong when retrieving file');
	}
};

export const DELETE: RequestHandler = async ({ request, params }) => {
	const { bucket, db } = await setupFiles();
	// const documents = db.collection<IDoc>('documents');
	// const folders = db.collection<IFolder>('folders');
	// * id here refers to id of file/folder
	const { userId, path } = await request.json();
	const { id } = params;

	// await deleteDoc(documents, folders, id, userId, path);
	// await bucket.delete(new ObjectId(id));

	try {
		await deleteFile(db, bucket, userId, path, id);

		return new Response('File: ' + id + ' deleted');
	} catch (err) {
		throw error(400, 'Something went wrong while deleting');
	}
};
