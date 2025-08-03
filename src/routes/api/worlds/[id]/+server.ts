import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import driver from '$lib/db/neo4j';

export const DELETE: RequestHandler = async ({ params, locals }) => {
	console.log('DELETE request received for world:', params.id);
	const user = locals.user;

	if (!user) {
		console.log('Unauthorized access attempt');
		return new Response(JSON.stringify({ message: 'Unauthorized' }), {
			status: 401,
			headers: { 'Content-Type': 'application/json' }
		});
	}

	const worldName = params.id;

	if (!worldName) {
		console.log('World name is required');
		return new Response(JSON.stringify({ message: 'World name is required' }), {
			status: 400,
			headers: { 'Content-Type': 'application/json' }
		});
	}

	const session = driver.session();

	try {
		console.log('Executing delete query for world:', worldName);
		await session.executeWrite((tx) =>
			tx.run(
				`
				MATCH (u:User {authid: $authid})-[:OWNS]->(w:World {name: $worldName})
				DETACH DELETE w
				`,
				{ authid: user.id, worldName }
			)
		);

		console.log('World deleted successfully:', worldName);
		return json({ message: 'World deleted successfully' });
	} catch (error) {
		console.error('Error deleting world:', error);
		return new Response(JSON.stringify({ message: 'Internal server error' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		});
	} finally {
		await session.close();
	}
};