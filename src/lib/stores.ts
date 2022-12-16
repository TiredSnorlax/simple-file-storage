import { writable } from 'svelte/store';
import type { IFolder, IFolderFilled, IUserFilled } from './types';

export const path = writable<string | null>(null);

export const user = writable<IUserFilled | null>(null);

export const currentFolder = writable<IFolderFilled>({ _id: '', foldername: '', children: [] });

export const resetCurrentFolder = () => {
	currentFolder.set({ _id: '', foldername: 'main', children: [] });
};

export const message = writable<string | null>(null);

export const errorMessage = writable<string | null>(null);
