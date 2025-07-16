import driver from '$lib/db/neo4j';
import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';
import type { GraphData, GraphNode, GraphEdge } from '$lib/types/graph';

export const GET: RequestHandler = async () => {
	const session = driver.session();

	try {
		const result = await session.run(`
			MATCH (w:World { name: "Luminwood Realm" })
			CALL apoc.path.subgraphAll(w, {}) YIELD nodes, relationships
			WITH nodes, relationships
			UNWIND nodes AS n
			UNWIND relationships AS r
			WITH COLLECT(DISTINCT n) AS nodes, COLLECT(DISTINCT r) AS relationships
			RETURN nodes, relationships
    	`);

		const nodes = new Map<string, GraphNode>();
		const edges: GraphEdge[] = [];

		const resultNodes = result.records[0].get('nodes');
		const resultRelationships = result.records[0].get('relationships');

		for (const node of resultNodes) {
			nodes.set(node.identity.toString(), {
				data: {
					id: node.identity.toString(),
					label: node.labels[0],
					...node.properties
				}
			});
		}

		for (const rel of resultRelationships) {
			edges.push({
				data: {
					id: rel.identity.toString(),
					source: rel.start.toString(),
					target: rel.end.toString(),
					label: rel.type,
					...rel.properties
				}
			});
		}

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
