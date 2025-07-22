import { json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
	const { worldId } = await request.json();
	console.log('Received build request for world ID (API):', worldId);
	const res = await fetch('http://localhost:8001/api/build', {
		method: 'POST',
		body: JSON.stringify({
			world_id: worldId
		}),
		headers: {
			'Content-Type': 'application/json'
		}
	});
	const data = await res.json();
	return json(data, { status: 201 });
};
