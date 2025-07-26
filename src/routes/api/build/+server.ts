import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async (event) => {
	const { world_id } = await event.request.json();
	const session = event.locals.session;
	const user = event.locals.user;

	if (!session || !user || !user.id) {
		return json({ message: 'Unauthorized' }, { status: 401 });
	}

	const user_id = user.id;

	console.log('building world', { world_id, user_id });

	const res = await fetch('http://localhost:8001/api/build', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ world_id, user_id })
	});

	return new Response(await res.text(), {
		status: res.status,
		headers: { 'Content-Type': res.headers.get('content-type') || 'application/json' }
	});
};
