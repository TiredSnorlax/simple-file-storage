import { updated } from '$app/stores';
import type { ID, IDoc, IFolder } from '$lib/types';
import { error } from '@sveltejs/kit';
import { Db, GridFSBucket, ObjectId, type Collection } from 'mongodb';
import { setupUsers } from './db';

export const getDocsFromId = async (ids: ID[] | undefined, documents: Collection<IDoc>) => {
	if (!ids) return [];
	const result = await documents.find({ _id: { $in: ids } }).toArray();
	return result;
};

export const createNewDoc = async (
	documents: Collection<IDoc>,
	userId: string | ObjectId,
	type: string,
	name: string,
	childId: string | ObjectId,
	path: string
) => {
	let fileType;

	if (type === 'file') fileType = name.split('.').pop()?.toLowerCase();
	else if (type === 'folder') fileType = 'folder';

	if (!fileType) return;
	const temp: IDoc = {
		user: userId,
		type,
		fileType,
		path,
		name,
		childId: childId,
		dateAdded: new Date(),
		lastUpdated: new Date()
	};

	const results = await documents.insertOne(temp);

	const newDoc = { ...temp, _id: results.insertedId };

	return newDoc;
};

export const deleteDoc = async (
	documents: Collection<IDoc>,
	folders: Collection<IFolder>,
	id: string | ObjectId,
	userId: string | ObjectId,
	path: string
) => {
	// TODO: Add user verification here and return an error if it is not user

	let updatedFolder = [];

	console.log(id);
	// * Delete document in collection
	const deletedDoc = await documents.findOneAndDelete({ childId: new ObjectId(id) });
	console.log(deletedDoc);

	// * Delete document in folder
	if (path === '/') {
		const { users } = await setupUsers();
		const re = await users.findOneAndUpdate(
			{ _id: new ObjectId(userId) },
			{ $pull: { mainFolder: new ObjectId(deletedDoc.value?._id) } },
			{ returnDocument: 'after' }
		);
		console.log(re.value);
		updatedFolder = re.value?.mainFolder ?? [];
	} else {
		const re = await folders.findOneAndUpdate(
			{ children: new ObjectId(id) },
			{ $pull: { children: new ObjectId(deletedDoc.value?._id) } },
			{ returnDocument: 'after' }
		);
		console.log(re.value);
		updatedFolder = re.value?.children ?? [];
	}

	updatedFolder = await getDocsFromId(updatedFolder, documents);
	return updatedFolder;
};

export const renameDoc = async (
	documents: Collection<IDoc>,
	folders: Collection<IFolder>,
	id: string | ObjectId,
	userId: string | ObjectId,
	path: string,
	newName: string
) => {
	// if (path === '/') {
	// 	const { users } = await setupUsers();
	// 	const userFilter = { _id: new ObjectId(userId) };
	// 	const user = await users.findOne(userFilter);

	// 	if (!user) throw error(400, 'no such user');
	// 	console.log(id);
	// 	console.log(user.mainFolder);
	// 	const index = user.mainFolder.findIndex((doc) => doc.childId.toString() === id);
	// 	if (index < 0) throw error(400, 'doc not in folder');
	// 	const _temp = [...user.mainFolder];
	// 	console.log(_temp, index);
	// 	_temp[index].name = newName;
	// 	console.log(_temp);

	// 	users.updateOne(userFilter, { $set: { mainFolder: _temp } });
	// } else {
	// 	const folderFilter = { children: { $elemMatch: { childId: new ObjectId(id) } } };
	// 	const folder = await folders.findOne(folderFilter);
	// 	if (!folder) throw error(400, 'no such folder');
	// 	const index = folder.children.findIndex((doc) => doc.childId.toString() === id);
	// 	if (index < 0) throw error(400, 'doc not in folder');
	// 	const _temp = [...folder.children];
	// 	_temp[index].name = newName;
	// 	console.log(_temp);
	// 	await folders.updateOne(folderFilter, { $set: { children: _temp } });
	// }

	await documents.updateOne({ childId: new ObjectId(id) }, { $set: { name: newName } });
};

const deletePreview = async (bucket: GridFSBucket, originalId: string | ObjectId) => {
	const preview = await bucket.find({ 'metadata.original': new ObjectId(originalId) }).toArray();
	if (preview) {
		await bucket.delete(preview[0]._id);
	}
};

export const deleteFile = async (
	db: Db,
	bucket: GridFSBucket,
	userId: string,
	path: string,
	id: string | ObjectId
) => {
	// * id here refers to id of file/folder
	const documents = db.collection<IDoc>('documents');
	const folders = db.collection<IFolder>('folders');

	// * Delete main file
	const updatedFolder = await deleteDoc(documents, folders, id, userId, path);
	await bucket.delete(new ObjectId(id));
	await deletePreview(bucket, id);

	return updatedFolder;
};

export const deleteFolder = async (
	db: Db,
	bucket: GridFSBucket,
	userId: string,
	path: string,
	id: string | ObjectId
) => {
	// * id here refers to id of file/folder
	const folders = db.collection<IFolder>('folders');
	const documents = db.collection<IDoc>('documents');

	const updatedFolder = await deleteDoc(documents, folders, id, userId, path);

	const folder = await folders.findOne({ _id: new ObjectId(id) });
	const result = await getDocsFromId(folder?.children, documents);
	for await (const doc of result) {
		if (!doc) return console.log('invalid doc in folder');
		if (doc.type === 'file') {
			await deleteFile(db, bucket, userId, path + doc._id + '/', doc.childId);
		} else if (doc.type === 'folder') {
			await deleteFolder(db, bucket, userId, path + doc._id + '/', doc.childId);
		}
	}
	console.log('Delete folder ' + id + ' in path: ' + path);
	await folders.deleteOne({ _id: new ObjectId(id) });
	return updatedFolder;
};

export const getFileDetails = async (bucket: GridFSBucket, id: string | ObjectId) => {
	console.log('get details of file: ' + id);
	const files = await bucket
		.find({ _id: new ObjectId(id) })
		.limit(1)
		.toArray();
	const file = files[0];
	return file;
};

export const getFolderDetails = async (db: Db, bucket: GridFSBucket, id: string | ObjectId) => {
	const folders = db.collection<IFolder>('folders');
	const folder = await folders.findOne({ _id: new ObjectId(id) });
	if (!folder) throw error(400, 'No such folder');

	let selfSize = 0;
	let selfFiles = 0;
	let selfFolders = 0;

	const result = await getDocsFromId(folder.children, db.collection<IDoc>('documents'));
	for await (const doc of result) {
		if (doc.type === 'file') {
			const { length } = await getFileDetails(bucket, doc.childId);
			selfFiles += 1;
			selfSize += length;
		} else if (doc.type === 'folder') {
			selfFolders += 1;
			const { totalSize, totalFiles, totalFolders } = await getFolderDetails(
				db,
				bucket,
				doc.childId
			);
			selfSize += totalSize;
			selfFiles += totalFiles;
			selfFolders += totalFolders;
		}
	}

	return { totalSize: selfSize, totalFiles: selfFiles, totalFolders: selfFolders };
};
