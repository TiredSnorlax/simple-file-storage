import type { ObjectId } from 'mongodb';

export type ID = string | ObjectId;

export type Permission = {
	user: ID;
	type: 'owner' | 'edit' | 'view';
};

export interface IDoc {
	_id?: ID;
	user: ID;
	permissions: Permission[];
	public: boolean;
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
	children: ID[];
}
export interface IFolderFilled {
	_id?: ID;
	foldername: string;
	children: IDoc[];
}

export interface IUser {
	_id?: ID;
	username: string;
	password: string;
	mainFolder: ID[];
}

export interface IUserFilled {
	_id: ID;
	username: string;
	password: string;
	mainFolder: IDoc[];
}
