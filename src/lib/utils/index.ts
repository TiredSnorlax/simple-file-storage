export const domain =
	process.env.NODE_ENV === 'production'
		? 'https://simple-file-storage.vercel.app/'
		: 'http://127.0.0.1:5173/';
