import { writable } from 'svelte/store';
import type { IFolder, IUser } from './types';

export const path = writable<string | null>(null);

export const user = writable<IUser | null>(null);

export const currentFolder = writable<IFolder>({ _id: '', foldername: '', children: [] });

export const resetCurrentFolder = () => {
	currentFolder.set({ _id: '', foldername: 'main', children: [] });
};
