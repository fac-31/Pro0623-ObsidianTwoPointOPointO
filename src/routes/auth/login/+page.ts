import type { PageLoad } from './$types';

export const load: PageLoad = async () => {
	const form = {
		email: '',
		password: ''
	};
	return { form };
};
