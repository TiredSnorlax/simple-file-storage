import { domain } from '$lib/utils';
import { error } from '@sveltejs/kit';
import axios from 'axios';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	return {
		files: []
	};
};
