import { setupFiles } from '$lib/database/db';
import { createNewDoc, getDocsFromId } from '$lib/database/helper';
import type { IFolder, IDoc, IUser } from '$lib/types';
import { error } from '@sveltejs/kit';
import { ObjectId } from 'mongodb';
import { Readable } from 'stream';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	const { bucket, db } = await setupFiles();
	const { userId, path, buffer, filename, folderId, parentPermissions } = await request.json();
	console.log('userid: ', userId);
	// change to cookie later
	// const userId = cookies.get('userId');

	const users = db.collection<IUser>('users');
	const documents = db.collection<IDoc>('documents');

	try {
		const _buffer = Buffer.from(buffer);
		const readable = Readable.from(_buffer);
		const uploadStream = bucket.openUploadStream(filename, {
			chunkSizeBytes: 1048576
		});
		readable.pipe(uploadStream);
		const newFileId = uploadStream.id;

		const user = await users.findOne<IUser>({ _id: new ObjectId(userId) });
		if (!user || !user._id) throw error(403, 'No user found');

		const newDoc = await createNewDoc(
			documents,
			user._id,
			'file',
			filename,
			newFileId,
			path,
			parentPermissions
		);

		if (!newDoc) throw error(400, 'No new doc');

		if (path === '/') {
			const updated = await users.findOneAndUpdate(
				{ _id: new ObjectId(userId) },
				{ $push: { mainFolder: new ObjectId(newDoc._id) } },
				{ returnDocument: 'after' }
			);

			const result = await getDocsFromId(updated.value?.mainFolder, documents);
			return new Response(JSON.stringify({ folder: result, newFileId }));
		} else {
			if (folderId === '') throw error(400, 'No folderId');
			const folders = db.collection<IFolder>('folders');
			const updated = await folders.findOneAndUpdate(
				{ _id: new ObjectId(folderId) },
				{ $push: { children: new ObjectId(newDoc._id) } },
				{ returnDocument: 'after' }
			);
			const result = await getDocsFromId(updated.value?.children, documents);
			return new Response(JSON.stringify({ folder: result, newFileId }));
		}
	} catch (err) {
		console.log(err);
		throw error(400, 'Something went wrong');
	}
};
