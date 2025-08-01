import { handlePromptWithDocs } from '$lib/langchain/dumb-relationship-query-agent';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
	const { query, docs } = await request.json();
	console.log('API received query:', query);
	console.log('API received docs:', docs);
	const response = await handlePromptWithDocs(query, docs);
	return json(response);
};
