import type { ObjectId } from 'mongodb';

type ID = string | ObjectId;

export interface IDoc {
	_id?: ID;
	user: ID;
	path: string;
	type: string;
	fileType: string;
	name: string;
	childId: ID;
	dateAdded: string | Date;
	lastUpdated: string | Date;
}

export interface IFile {
	_id: ID;
	length: number;
	chunkSize: number;
	uploadDate: string;
	filename: string;
}

export interface IFolder {
	_id?: ID;
	foldername: string;
	children: IDoc[];
}

export interface IUser {
	_id: ID;
	username: string;
	password: string;
	email: string;
	mainFolder: IDoc[];
}
