import { setupDb } from '$lib/database/db';
import { renameDoc } from '$lib/database/helper';
import type { IDoc, IFolder } from '$lib/types';
import { error } from '@sveltejs/kit';
import { ObjectId } from 'mongodb';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ params, request }) => {
	const { db } = await setupDb();
	const documents = db.collection<IDoc>('documents');
	const folders = db.collection<IFolder>('folders');

	const { userId, path, newName } = await request.json();
	const { id } = params;
	try {
		await renameDoc(documents, folders, id, userId, path, newName);
		await folders.updateOne({ _id: new ObjectId(id) }, { $set: { foldername: newName } });
		return new Response('Renamed folder successfully');
	} catch (err) {
		console.log(err);
		throw error(400, 'Something went wrong when renaming');
	}
};
