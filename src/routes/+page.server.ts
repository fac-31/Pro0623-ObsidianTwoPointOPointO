import type { PageServerLoad } from './$types';
import driver from '$lib/db/neo4j';
import type { GraphData } from '$lib/types/graph';

export const load: PageServerLoad = async () => {
	const session = driver.session();
	try {
		const result = await session.run('MATCH (n:World) RETURN n');
		const nodes = result.records
			.map((record) => {
				const node = record.get('n');
				if (!node || !node.properties) {
					return null;
				}
				return {
					data: {
						id: node.identity.toString(),
						label: node.labels ? node.labels.join(', ') : 'Node',
						...node.properties
					}
				};
			})
			.filter((n) => n !== null);

		const graphData: GraphData = {
			nodes,
			edges: []
		};

		return {
			graphData
		};
	} catch (error) {
		console.error('Failed to load world data:', error);
		const graphData: GraphData = {
			nodes: [],
			edges: []
		};
		return {
			graphData
		};
	} finally {
		await session.close();
	}
};
