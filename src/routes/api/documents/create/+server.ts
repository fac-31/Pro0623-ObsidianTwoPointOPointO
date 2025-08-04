import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import driver from '$lib/db/neo4j';

export const POST: RequestHandler = async (event) => {
	console.log('Received request to create a new document.');

	const { session: userSession } = await event.locals.safeGetSession();

	// 1. Authenticate the user
	if (!userSession?.user?.id) {
		console.error('Authentication failed: No session or user ID found.');
		return json({ message: 'Unauthorized' }, { status: 401 });
	}
	const userId = userSession.user.id;
	console.log(`Authenticated user with ID: ${userId}`);

	// 2. Get data from the request body
	const { title, content, worldId } = await event.request.json();
	console.log('Request body:', { title, content, worldId });

	if (!title || !content) {
		console.error('Validation failed: Missing required fields.');
		return json({ message: 'Missing required fields: title or content' }, { status: 400 });
	}

	const session = driver.session();

	try {
		console.log('Executing Cypher query to create document...');
		// 3. Execute the Cypher Query
		const result = await session.executeWrite((tx) =>
			tx.run(
				`
	MATCH (w) WHERE elementId(w) = $worldId

    CREATE (d:Document {
      title: $title,
      content: $content,
      createdBy: $userId,
	  worldId: $worldId
    })-[:DESCRIBES]->(w)

	RETURN d
    `,
				{ userId, title, content, worldId }
			)
		);
		console.log('Cypher query executed successfully.');

		if (!result.records || result.records.length === 0) {
			throw new Error('Failed to create document in the database: No records returned.');
		}

		const createdDocument = result.records[0].get('d');
		const responseNode = {
			id: createdDocument.elementId,
			labels: createdDocument.labels,
			properties: createdDocument.properties
		};
		console.log('Document created successfully in Neo4j:', responseNode);

		return json(
			{ message: 'Document created successfully', document: responseNode },
			{ status: 201 }
		);
	} catch (error) {
		console.error('---!! ERROR CREATING DOCUMENT !!---');
		console.error('Failed to create document:', error);
		const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
		return json({ message: 'Failed to create document', error: errorMessage }, { status: 500 });
	} finally {
		console.log('Building world with ID (API):', worldId);
		try {
			const url = new URL(event.request.url);
			const absoluteUrl = url.origin + '/api/build';
			const response = await event.fetch(absoluteUrl, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ world_id: worldId })
			});
			if (!response.ok) {
				console.log('Failed to build world');
			}
			const result = await response.json();
			console.log('World built successfully:', result);
		} catch (error) {
			console.error('Error building world:', error);
		} finally {
			/*
			await session.executeWrite((tx) =>
				tx.run(
					`
                    MATCH (w) WHERE elementId(w) = $worldId
                    MATCH (n)<-[:HAS_ENTITY]-(c:Chunk)-[:PART_OF]->(d:Document)-[:DESCRIBES]->(w)
                    MERGE (n)-[:EXISTS_IN]->(w)
					SET n.name = n.id
					REMOVE n.id
                    `,
					{ worldId }
				)
			);
			*/
			await session.close();
		}
	}
};
