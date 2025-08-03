import type { Load } from '@sveltejs/kit';
import type { GraphData } from '$lib/types/graph';

export const load: Load = async ({ params, fetch }) => {
	const res = await fetch(`/worlds/${params.id}`);
	if (!res.ok) throw new Error('Failed to fetch query response');

	const graphData: GraphData = await res.json();

	if (!graphData || !graphData.nodes) {
		return {
			graphData: { nodes: [], edges: [], worldInfo: {} },
			graphTitle: 'World not found',
			worldInfo: {}
		};
	}

	graphData.nodes = graphData.nodes?.map((node) => ({
		...node,
		data: {
			...node.data,
			label: node.data.name || node.data.title || 'Untitled'
		}
	}));

	const graphTitle =
		graphData.worldInfo?.name ||
		graphData.worldInfo?.title ||
		graphData.worldInfo?.label ||
		'Untitled World';

	return { graphData, graphTitle, worldInfo: graphData.worldInfo };
};
