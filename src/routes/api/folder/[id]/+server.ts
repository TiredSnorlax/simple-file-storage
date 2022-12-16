import { setupDb, setupFiles } from '$lib/database/db';
import { deleteFolder, getDocsFromId } from '$lib/database/helper';
import type { IDoc } from '$lib/types';
import { error } from '@sveltejs/kit';
import { ObjectId } from 'mongodb';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params }) => {
	const { db } = await setupDb();

	const folders = db.collection('folders');
	const documents = db.collection<IDoc>('documents');

	const { id } = params;

	try {
		const folder = await folders.findOne({ _id: new ObjectId(id) });
		const children = await getDocsFromId(folder?.children, documents);

		if (!folder) throw error(400, 'No such folder.');
		const re = { ...folder };
		re.children = children;
		return new Response(JSON.stringify(re));
	} catch (err) {
		throw error(400, 'Error when retrieving folder.');
	}
};

export const DELETE: RequestHandler = async ({ request, params }) => {
	const { db, bucket } = await setupFiles();
	// const folders = db.collection<IFolder>('folders');
	// const documents = db.collection<IDoc>('documents');
	// * id here refers to id of file/folder
	const { userId, path } = await request.json();
	const { id } = params;

	console.log('delete file server: ' + path);

	// await deleteDoc(documents, folders, id, userId, path);
	// await folders.deleteOne({ _id: new ObjectId(id) });

	try {
		const updatedFolder = await deleteFolder(db, bucket, userId, path, id);
		return new Response(JSON.stringify({ folder: updatedFolder }));
	} catch (err) {
		console.log(err);
		throw error(400, 'Something went wrong while deleting');
	}
};
