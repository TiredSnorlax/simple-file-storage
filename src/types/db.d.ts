import { MongoClient } from 'mognodb';
declare global {
	// eslint-disable-next-line no-var
	var _mongoClientPromise: Promise<MongoClient>;
}
