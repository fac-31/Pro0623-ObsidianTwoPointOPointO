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
	const { title, content } = await event.request.json();
	console.log('Request body:', { title, content });

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
    CREATE (d:Document {
      title: $title,
      content: $content,
      createdBy: $userId
    })
    RETURN d
    `,
				{ userId, title, content }
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
		await session.close();
	}
};
