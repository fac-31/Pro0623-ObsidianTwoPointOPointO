import driver from '$lib/db/neo4j';
import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';
import type { GraphData, GraphNode, GraphEdge } from '$lib/types/graph';
import type { Node, Relationship } from 'neo4j-driver';

export const GET: RequestHandler = async ({ params }) => {
	const session = driver.session();
	const worldId = params.id;
	console.log(worldId);

	try {
		// World node
		const worldResult = await session.run(`MATCH (w) WHERE elementId(w) = $worldId RETURN w`, {
			worldId
		});

		if (worldResult.records.length === 0) {
			return new Response('World not found', { status: 404 });
		}

		const worldNode: Node = worldResult.records[0].get('w');

		// Neighbor nodes and their internal relationships
		const graphResult = await session.run(
			`
			MATCH (w) WHERE elementId(w) = $worldId
			MATCH (n)<-[:HAS_ENTITY]-(c:Chunk)-[:PART_OF]->(d:Document)-[:DESCRIBES]->(w)
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

		const nodes = new Map<string, GraphNode>();
		const addNode = (node: Node) => {
			const elementId = node.elementId;
			if (!nodes.has(elementId)) {
				nodes.set(elementId, {
					data: {
						...node.properties,
						id: elementId,
						name: node.properties.id,
						type: node.labels[0]
					}
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

		const relTypes = edges.map((edge) => edge.data.label);

		const graphData: GraphData = {
			nodes: Array.from(nodes.values()),
			edges,
			relTypes,
			worldInfo: {
				label: worldNode.labels[0],
				...worldNode.properties
			}
		};

		console.log(nodes);
		console.log(graphData.nodes);
		console.log(graphData.edges);

		return json(graphData);
	} catch (err) {
		console.error(err);
		return new Response('Error querying graph', { status: 500 });
	} finally {
		await session.close();
	}
};
