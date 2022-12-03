import { setupFiles } from '$lib/database/db';
import { createNewDoc } from '$lib/database/helper';
import type { IFolder, IDoc, IUser } from '$lib/types';
import { error } from '@sveltejs/kit';
import { ObjectId } from 'mongodb';
import { Readable } from 'stream';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	const { bucket, db } = await setupFiles();
	const { userId, path, buffer, filename, folderId } = await request.json();
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
		if (!user) throw error(403, 'No user found');

		const newDoc = await createNewDoc(documents, user._id, 'file', filename, newFileId, path);

		if (path === '/') {
			const updated = await users.findOneAndUpdate(
				{ _id: new ObjectId(userId) },
				{ $push: { mainFolder: newDoc } },
				{ returnDocument: 'after' }
			);
			return new Response(JSON.stringify(updated.value?.mainFolder));
		} else {
			if (folderId === '') throw error(400, 'No folderId');
			const folders = db.collection<IFolder>('folders');
			const updated = await folders.findOneAndUpdate(
				{ _id: new ObjectId(folderId) },
				{ $push: { children: newDoc } },
				{ returnDocument: 'after' }
			);
			return new Response(JSON.stringify(updated.value?.children));
		}
	} catch (err) {
		console.log(err);
		throw error(400, 'Something went wrong');
	}
};