import { json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import driver from '$lib/db/neo4j';

export const POST: RequestHandler = async ({ request }) => {
	const { name, content } = await request.json();

	const session = driver.session();

	try {
		const result = await session.run('MATCH (n {name: $name}) SET n.content = $content RETURN n', {
			name,
			content
		});

		if (result.records.length === 0) {
			return json({ success: false, message: 'Node not found' }, { status: 404 });
		}

		return json({ success: true });
	} catch (error) {
		console.error('Error updating node:', error);
		return json({ success: false, message: 'Failed to update node' }, { status: 500 });
	} finally {
		await session.close();
	}
};
