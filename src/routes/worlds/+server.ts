import driver from '$lib/db/neo4j';
import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';
import type { GraphData, GraphNode, GraphEdge } from '$lib/types/graph';

export const GET: RequestHandler = async () => {
	const session = driver.session();

	try {
		const result = await session.run(
			`
			MATCH (u:User)-[:OWNS]->(n)
			RETURN u.name AS user, elementId(u) AS userId, labels(u) as userLabels, n.name AS node, elementId(n) AS nodeId, labels(n) as nodeLabels
			`
		);

		const nodes: GraphNode[] = [];
		const edges: GraphEdge[] = [];
		const nodeIds = new Set<string>();
		const edgeKeys = new Set<string>();

		for (const rec of result.records) {
			const user = rec.get('user');
			const userId = rec.get('userId');
			const userLabels = rec.get('userLabels');
			const node = rec.get('node');
			const nodeId = rec.get('nodeId');
			const nodeLabels = rec.get('nodeLabels');

			// Add user node
			if (!nodeIds.has(userId)) {
				nodes.push({
					data: {
						id: userId,
						label: 'User',
						name: user,
						type: userLabels[0]
					}
				});
				nodeIds.add(userId);
			}

			// Add owned node
			if (!nodeIds.has(nodeId)) {
				nodes.push({
					data: {
						id: nodeId,
						label: 'Node',
						name: node,
						type: nodeLabels[0]
					}
				});
				nodeIds.add(nodeId);
			}

			// Add edge if not already added
			const edgeKey = `${userId}->${nodeId}`;
			if (!edgeKeys.has(edgeKey)) {
				edges.push({
					data: {
						source: userId,
						target: nodeId,
						label: 'OWNS'
					}
				});
				edgeKeys.add(edgeKey);
			}
		}

		const graphData: GraphData = {
			nodes,
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
