import type { ID, IDoc, IFolder, IUser, Permission, UserPermission } from '$lib/types';
import { error } from '@sveltejs/kit';
import { Db, GridFSBucket, ObjectId, type Collection, type WithId } from 'mongodb';
import { setupDocuments, setupUsers } from './db';

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
	path: string,
	parentPermissions: Permission[] | null
) => {
	let fileType;

	if (type === 'file') fileType = name.split('.').pop()?.toLowerCase();
	else if (type === 'folder') fileType = 'folder';

	// TODO add permissions from parent folder if any
	if (!fileType) return;

	const temp: IDoc = {
		user: new ObjectId(userId),
		permissions: [],
		isPublic: false,
		type,
		fileType,
		path,
		name,
		childId: childId,
		dateAdded: new Date(),
		lastUpdated: new Date()
	};

	console.log(parentPermissions);
	if (parentPermissions)
		temp.permissions = parentPermissions.map((perm) => ({
			user: new ObjectId(perm.user),
			type: perm.type
		}));

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

	// * Delete document in collection
	const deletedDoc = await documents.findOneAndDelete({ childId: new ObjectId(id) });
	// * Delete document in folder
	if (path === '/') {
		const { users } = await setupUsers();
		const re = await users.findOneAndUpdate(
			{ _id: new ObjectId(userId) },
			{ $pull: { mainFolder: new ObjectId(deletedDoc.value?._id) } },
			{ returnDocument: 'after' }
		);
		updatedFolder = re.value?.mainFolder ?? [];
	} else {
		const re = await folders.findOneAndUpdate(
			{ children: new ObjectId(deletedDoc.value?._id) },
			{ $pull: { children: new ObjectId(deletedDoc.value?._id) } },
			{ returnDocument: 'after' }
		);
		updatedFolder = re.value?.children ?? [];
	}

	const re = await getDocsFromId(updatedFolder, documents);
	console.log(updatedFolder);
	return re;
};

export const renameDoc = async (
	documents: Collection<IDoc>,
	id: string | ObjectId,
	newName: string
) => {
	await documents.updateOne({ childId: new ObjectId(id) }, { $set: { name: newName } });
};

const deletePreview = async (bucket: GridFSBucket, originalId: string | ObjectId) => {
	const cursor = bucket.find({ 'metadata.original': new ObjectId(originalId) });
	if (!cursor) return;
	const preview = await cursor.toArray();
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

export const getPermissions = async (
	session: string | undefined,
	type: string,
	childId: string,
	docs?: Collection<IDoc>
) => {
	if (!session) return null;

	if (!docs) {
		const setup = await setupDocuments();
		docs = setup.docs;
	}

	const doc = await docs.findOne({ childId: new ObjectId(childId), type });

	if (doc?.user.toString() === session) return 'owner';

	const _perm = doc?.permissions.find((perm) => perm.user.toString() === session);

	if (doc?.isPublic && _perm?.type !== 'edit') return 'view';

	if (!_perm) return null;

	return _perm.type;
};

export const setPermissions = async (
	docs: Collection<IDoc>,
	folders: Collection<IFolder>,
	isPublic: boolean,
	updatedUserPermissions: UserPermission[],
	docId: ID
) => {
	const userPermissions = updatedUserPermissions.map((perm: UserPermission) => {
		return { user: new ObjectId(perm.user._id), type: perm.type };
	});

	const res = await docs.findOneAndUpdate(
		{ _id: new ObjectId(docId) },
		{ $set: { permissions: userPermissions, isPublic } },
		{ returnDocument: 'after' }
	);

	if (res.value?.type === 'folder') {
		const updated = res.value;
		const folder = await folders.findOne({ _id: new ObjectId(updated.childId) });
		// if (folder) {
		// 	const childrenIds = folder?.children.map((id) => new ObjectId(id));
		// 	docs.updateMany({ _id: { $in: childrenIds } }, {$set: {permissions: userPermissions}});
		// }
		if (folder) {
			for await (const id of folder.children) {
				await setPermissions(docs, folders, isPublic, updatedUserPermissions, id);
			}
		}
	}

	return res.value;
};
