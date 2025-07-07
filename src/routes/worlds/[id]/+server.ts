import driver from '$lib/db/neo4j';
import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';
import type { GraphData, GraphNode, GraphEdge } from '$lib/types/graph';

export const GET: RequestHandler = async () => {
	const session = driver.session();

	try {
		const result = await session.run(
			`
      MATCH (n)-[r]->(m)
      RETURN n, r, m
      LIMIT 500
    `
		);

		const nodes = new Map<string, GraphNode>();
		const edges: GraphEdge[] = [];

		for (const rec of result.records) {
			const n = rec.get('n');
			const m = rec.get('m');
			const r = rec.get('r');

			nodes.set(n.identity.toString(), {
				data: { id: n.identity.toString(), label: n.labels[0], ...n.properties }
			});

			nodes.set(m.identity.toString(), {
				data: { id: m.identity.toString(), label: m.labels[0], ...m.properties }
			});

			edges.push({
				data: {
					id: r.identity.toString(),
					source: n.identity.toString(),
					target: m.identity.toString(),
					label: r.type,
					...r.properties
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
