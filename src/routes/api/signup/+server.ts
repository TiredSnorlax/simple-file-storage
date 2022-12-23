import type { RequestHandler } from './$types';
import { setupFiles } from '$lib/database/db';
import { error } from '@sveltejs/kit';
import type { IUser } from '$lib/types';
import { Readable } from 'stream';
import { ObjectId } from 'mongodb';

export const POST: RequestHandler = async ({ request }) => {
	const { username, email, password, buffer } = await request.json();
	const { bucket, db } = await setupFiles();
	const newId = new ObjectId();
	const _user: IUser = {
		_id: newId,
		username,
		email,
		password,
		mainFolder: []
	};

	const users = db.collection<IUser>('users');
	const exists = await users.findOne({ username });
	if (exists) throw error(400, 'User already exists');
	try {
		if (buffer) {
			const _buffer = Buffer.from(buffer);
			const readable = Readable.from(_buffer);
			const uploadStream = bucket.openUploadStream(newId.toString() + '-profileImg', {
				chunkSizeBytes: 1048576
			});
			readable.pipe(uploadStream);
			const newFileId = uploadStream.id;

			_user.picture = new ObjectId(newFileId);
		}
		console.log(_user);
		const newUser = await users.insertOne(_user);

		return new Response(JSON.stringify(newUser));
	} catch (err) {
		console.log(err);
		throw error(400, 'Error happened when creating user');
	}
};
