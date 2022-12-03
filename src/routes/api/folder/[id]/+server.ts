import { setupFiles, setupFolders } from '$lib/database/db';
import { deleteFolder } from '$lib/database/helper';
import { error } from '@sveltejs/kit';
import { ObjectId } from 'mongodb';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params }) => {
	const { folders } = await setupFolders();

	const { id } = params;

	try {
		const folder = await folders.findOne({ _id: new ObjectId(id) });
		return new Response(JSON.stringify(folder));
	} catch (err) {
		throw error(400, 'No such folder.');
	}
};

export const DELETE: RequestHandler = async ({ request, params }) => {
	const { db, bucket } = await setupFiles();
	// const folders = db.collection<IFolder>('folders');
	// const documents = db.collection<IDoc>('documents');
	// * id here refers to id of file/folder
	const { type, userId, path } = await request.json();
	const { id } = params;

	// await deleteDoc(documents, folders, id, userId, path);
	// await folders.deleteOne({ _id: new ObjectId(id) });

	try {
		await deleteFolder(db, bucket, userId, path, id);
		return new Response(type + id + ' deleted');
	} catch (err) {
		throw error(400, 'Something went wrong while deleting');
	}
};
