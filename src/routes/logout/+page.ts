import { domain } from '$lib/utils';
import type { PageLoad } from './$types';
export const load: PageLoad = async () => {
	const res = await fetch(domain + 'api/logout', { method: 'post' });
	const data = await res.json();

	return data;
};
