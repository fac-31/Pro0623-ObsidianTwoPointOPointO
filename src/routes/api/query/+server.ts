import { json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import { handleQuery } from '$lib/langchain/relationship-query-agent.js';

export const POST: RequestHandler = async ({ request }) => {
	const { query, worldName } = await request.json();
	const response = await handleQuery(query, worldName);
	console.log('Hello!');
	return json(response);
};
