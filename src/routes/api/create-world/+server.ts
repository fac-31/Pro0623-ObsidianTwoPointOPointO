import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import driver from '$lib/db/neo4j';

export const POST: RequestHandler = async ({ request, locals }) => {
	const user = locals.user;

	if (!user) {
		return new Response(JSON.stringify({ message: 'Unauthorized' }), {
			status: 401,
			headers: { 'Content-Type': 'application/json' }
		});
	}

	const { name, content } = await request.json();

	if (!name) {
		return new Response(JSON.stringify({ message: 'World name is required' }), {
			status: 400,
			headers: { 'Content-Type': 'application/json' }
		});
	}
	if (!content) {
		return new Response(JSON.stringify({ message: 'Content is required' }), {
			status: 400,
			headers: { 'Content-Type': 'application/json' }
		});
	}

	const session = driver.session();

	try {
		const result = await session.executeWrite((tx) =>
			tx.run(
				`
                MATCH (u:User {authid: $authid})
                CREATE (w:World {
                    id: randomUUID(),
                    name: $name,
                    content: $content,
                    createdAt: datetime()
                })
                MERGE (u)-[:OWNS]->(w)
                RETURN w
                `,
				{ authid: user.id, name, content }
			)
		);

		const world = result.records[0]?.get('w').properties;

		return json({ world });
	} catch (error) {
		console.error('Error creating world:', error);
		return new Response(JSON.stringify({ message: 'Internal server error' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		});
	} finally {
		await session.close();
	}
};
