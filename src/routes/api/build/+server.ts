import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async (event) => {
	const { world_id } = await event.request.json();
	const session = await event.locals.getSession();

	if (!session?.user?.id) {
		return json({ message: 'Unauthorized' }, { status: 401 });
	}

	const user_id = session.user.id;

	console.log('building world', { world_id, user_id });

	const res = await fetch('http://localhost:8001/api/build', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ world_id, user_id })
	});

	return res;
};
