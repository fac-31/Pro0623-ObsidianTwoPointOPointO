import driver from '$lib/db/neo4j';
import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';
import type { GraphData, GraphNode, GraphEdge } from '$lib/types/graph';
import type { Node, Relationship } from 'neo4j-driver';

export const GET: RequestHandler = async ({ params }) => {
	const session = driver.session();
	const worldId = params.id;

	try {
		const result = await session.run(
			`
			MATCH (w) WHERE elementId(w) = $worldId
			MATCH (w)--(n)
			WITH collect(DISTINCT n) as nodes
			UNWIND nodes as a
			OPTIONAL MATCH (a)-[r]-(b)
			WHERE b IN nodes AND elementId(a) < elementId(b)
			WITH nodes, collect(DISTINCT r) as relationships
			RETURN nodes, relationships
			`,
			{ worldId }
		);

		if (result.records.length === 0) {
			return new Response('World not found', { status: 404 });
		}

		const record = result.records[0];
		const neighborNodes = record.get('nodes');
		const relationships = record.get('relationships');

		const nodes = new Map<string, GraphNode>();
		const addNode = (node: Node) => {
			const elementId = node.elementId;
			if (!nodes.has(elementId)) {
				nodes.set(elementId, {
					data: { id: elementId, label: node.labels[0], ...node.properties }
				});
			}
		};

		neighborNodes.forEach(addNode);

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
			edges
		};

		return json(graphData);
	} catch (err) {
		console.error(err);
		return new Response('Error querying graph', { status: 500 });
	} finally {
		await session.close();
	}
};
