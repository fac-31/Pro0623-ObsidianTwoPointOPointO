import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async () => {
	return { count: 3 };
};
