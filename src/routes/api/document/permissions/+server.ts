import { setupDb } from '$lib/database/db';
import { setPermissions } from '$lib/database/helper';
import type { IFolder, IDoc, IUser } from '$lib/types';
import { error } from '@sveltejs/kit';
import { ObjectId } from 'mongodb';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }) => {
	const { db } = await setupDb();

	const docs = db.collection<IDoc>('documents');
	const users = db.collection<IUser>('users');

	const childId = url.searchParams.get('childId') || '';
	const type = url.searchParams.get('type') || '';

	try {
		const doc = await docs.findOne({ childId: new ObjectId(childId), type });
		if (!doc) throw error(400, 'No such file/folder');

		const _ids = doc.permissions.map((perm) => perm.user);

		const permUsers = await users.find({ _id: { $in: _ids } }).toArray();

		const re = [];

		for (let i = 0; i < doc.permissions.length; i++) {
			const perm = doc.permissions[i];
			const user = permUsers.find(
				(user) => user._id.toString() === doc.permissions[i].user.toString()
			);
			if (user) {
				re.push({ user, type: perm.type });
			}
		}

		return new Response(JSON.stringify(re));
	} catch (err) {
		console.log(err);
		throw error(400, 'Error when retrieving permissions');
	}
};

export const POST: RequestHandler = async ({ request }) => {
	const { db } = await setupDb();

	const docs = db.collection<IDoc>('documents');
	const folders = db.collection<IFolder>('folders');

	const { isPublic, updatedUserPermissions, docId } = await request.json();
	// const userPermissions = updatedUserPermissions.map((perm: UserPermission) => {
	// 	return { user: new ObjectId(perm.user._id), type: perm.type };
	// });

	// try {
	// 	const res = await docs.findOneAndUpdate(
	// 		{ _id: new ObjectId(docId) },
	// 		{ $set: { permissions: userPermissions, isPublic } },
	// 		{ returnDocument: 'after' }
	// 	);

	// 	return new Response(
	// 		JSON.stringify({ doc: res.value, message: 'Updated permissions successfully!' })
	// 	);
	// } catch (err) {
	// 	console.log(err);
	// 	throw error(400, 'Error when retrieving permissions');
	// }

	try {
		const doc = await setPermissions(docs, folders, isPublic, updatedUserPermissions, docId);
		return new Response(JSON.stringify({doc, message: 'Updated permissions successfully'}));
	} catch (err) {
		console.log(err);
		throw error(400, 'Error when retrieving permissions');
	}
};
