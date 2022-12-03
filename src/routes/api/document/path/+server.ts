import { setupFolders } from '$lib/database/db';
import { ObjectId } from 'mongodb';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	const { path }: { path: string } = await request.json();

	if (path.length === 1) return new Response(JSON.stringify([]));
	const pathArray = path.slice(1, -1).split('/');
	const idArray = pathArray.map((id) => new ObjectId(id));

	const { folders } = await setupFolders();
	const pathFolders = await folders.find({ _id: { $in: idArray } }).toArray();

	return new Response(JSON.stringify(pathFolders));
};
