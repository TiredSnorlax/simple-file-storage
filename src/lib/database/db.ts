import type { IFolder, IDoc, IUser } from '$lib/types';
import mongodb, { MongoClient } from 'mongodb';

// if (!process.env.MONGODB_URI) {
//   throw new Error('Invalid/Missing environment variable: "MONGODB_URI"')
// }

const uri = 'mongodb+srv://admin:admin@cluster0.l6hq8es.mongodb.net/?retryWrites=true&w=majority';
console.log(uri);
const options = {};

let client;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
	// In development mode, use a global variable so that the value
	// is preserved across module reloads caused by HMR (Hot Module Replacement).
	if (!global._mongoClientPromise) {
		client = new MongoClient(uri, options);
		global._mongoClientPromise = client.connect();
	}
	clientPromise = global._mongoClientPromise;
} else {
	// In production mode, it's best to not use a global variable.
	client = new MongoClient(uri, options);
	clientPromise = client.connect();
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise;

export const setupDb = async () => {
	client = await clientPromise;
	const db = client.db('files');
	return { db };
};

export const setupFiles = async () => {
	client = await clientPromise;
	const db = client.db('files');
	const bucket = new mongodb.GridFSBucket(db, { bucketName: 'myCustomBucket' });
	return { db, bucket };
};

export const setupDocuments = async () => {
	client = await clientPromise;
	const db = client.db('files');
	const docs = db.collection<IDoc>('documents');
	return { docs };
};

export const setupFolders = async () => {
	client = await clientPromise;
	const db = client.db('files');
	const folders = db.collection<IFolder>('folders');
	return { folders };
};

export const setupUsers = async () => {
	client = await clientPromise;
	const db = client.db('files');
	const users = db.collection<IUser>('users');
	return { users };
};
