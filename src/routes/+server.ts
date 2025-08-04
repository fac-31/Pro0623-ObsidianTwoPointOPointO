import driver from '$lib/db/neo4j';
import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';
import type { GraphData, GraphNode } from '$lib/types/graph';

export const GET: RequestHandler = async () => {
	const session = driver.session();

	try {
		const result = await session.run(
			`
      MATCH (w:World)
      RETURN w, elementId(w) as elementId
    `
		);

		const nodes: GraphNode[] = [];

		for (const rec of result.records) {
			const w = rec.get('w');
			const elementId = rec.get('elementId');
			nodes.push({
				data: { id: elementId, label: w.labels[0], ...w.properties }
			});
		}

		const graphData: GraphData = {
			nodes: nodes,
			edges: []
		};

		return json(graphData);
	} catch (err) {
		console.error(err);
		return new Response('Error querying graph', { status: 500 });
	} finally {
		await session.close();
	}
};
