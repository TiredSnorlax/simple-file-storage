import { setupDb } from '$lib/database/db';
import { createNewDoc, getDocsFromId } from '$lib/database/helper';
import type { IDoc, IFolder, IUser } from '$lib/types';
import { error } from '@sveltejs/kit';
import { ObjectId } from 'mongodb';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	const { db } = await setupDb();

	const folders = db.collection<IFolder>('folders');
	const users = db.collection<IUser>('users');
	const documents = db.collection<IDoc>('documents');

	const { foldername, path, userId, folderId } = await request.json();

	try {
		const tempFolder = {
			foldername,
			children: []
		};

		const results = await folders.insertOne(tempFolder);

		const newDoc = await createNewDoc(
			documents,
			userId,
			'folder',
			foldername,
			results.insertedId,
			path
		);

		if (!newDoc) throw error(400, 'No new doc');

		if (path === '/') {
			const updated = await users.findOneAndUpdate(
				{ _id: new ObjectId(userId) },
				{ $push: { mainFolder: newDoc._id } },
				{ returnDocument: 'after' }
			);
			const result = await getDocsFromId(updated.value?.mainFolder, documents);
			return new Response(JSON.stringify(result));
		} else {
			if (folderId === '') throw error(400, 'No folderId');
			const folders = db.collection<IFolder>('folders');
			const updated = await folders.findOneAndUpdate(
				{ _id: new ObjectId(folderId) },
				{ $push: { children: newDoc._id } },
				{ returnDocument: 'after' }
			);
			const result = await getDocsFromId(updated.value?.children, documents);
			return new Response(JSON.stringify(result));
		}
	} catch (err) {
		console.log(err);
		throw error(400, 'Something went wrong');
	}
};
