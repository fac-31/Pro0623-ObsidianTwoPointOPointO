import driver from '$lib/db/neo4j';
import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';
import type { GraphData, GraphNode, GraphEdge } from '$lib/types/graph';
import type { Node, Relationship } from 'neo4j-driver';

export const GET: RequestHandler = async ({ params }) => {
	const session = driver.session();
	const worldId = params.id;

	try {
		// Fetch the World node
		const worldResult = await session.run(`MATCH (w) WHERE elementId(w) = $worldId RETURN w`, {
			worldId
		});

		if (worldResult.records.length === 0) {
			return new Response('World not found', { status: 404 });
		}

		const worldNode: Node = worldResult.records[0].get('w');

		// Fetch neighbors and internal relationships (excluding User, but INCLUDING Document)
		const graphResult = await session.run(
			`
			MATCH (w) WHERE elementId(w) = $worldId
			MATCH (w)--(n)
			WHERE NONE(label IN labels(n) WHERE label = 'User')
			WITH collect(DISTINCT n) AS nodes
			UNWIND nodes AS a
			OPTIONAL MATCH (a)-[r]-(b)
			WHERE b IN nodes AND elementId(a) < elementId(b)
			WITH nodes, collect(DISTINCT r) AS relationships
			RETURN nodes, relationships
			`,
			{ worldId }
		);

		const graphRecord = graphResult.records[0];
		const neighborNodes = graphRecord.get('nodes');
		const relationships = graphRecord.get('relationships');

		// Convert nodes to GraphNode format
		const nodes = new Map<string, GraphNode>();
		const addNode = (node: Node) => {
			const elementId = node.elementId;
			if (!nodes.has(elementId)) {
				nodes.set(elementId, {
					data: {
						id: elementId,
						name: node.properties.name,
						type: node.labels[0],
						...node.properties
					}
				});
			}
		};

		neighborNodes.forEach(addNode);

		// Convert relationships to GraphEdge format
		const edges: GraphEdge[] = relationships.map((rel: Relationship) => ({
			data: {
				id: rel.elementId,
				source: rel.startNodeElementId,
				target: rel.endNodeElementId,
				label: rel.type,
				...rel.properties
			}
		}));

		const graphData: GraphData = {
			nodes: Array.from(nodes.values()),
			edges,
			worldInfo: {
				label: worldNode.labels[0],
				...worldNode.properties
			}
		};

		return json(graphData);
	} catch (err) {
		console.error(err);
		return new Response('Error querying graph', { status: 500 });
	} finally {
		await session.close();
	}
};

export const POST: RequestHandler = async ({ request }) => {
	const { worldId } = await request.json();
	console.log('Received build request for world ID:', worldId);

	const res = await fetch('http://localhost:8001/api/build', {
		method: 'POST',
		body: JSON.stringify({ world_id: worldId }),
		headers: {
			'Content-Type': 'application/json'
		}
	});

	const data = await res.json();
	return json(data, { status: 201 });
};
