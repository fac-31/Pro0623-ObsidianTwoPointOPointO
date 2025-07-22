import type { Load } from '@sveltejs/kit';
import type { GraphData } from '$lib/types/graph';

export const load: Load = async ({ params, fetch }) => {
	const res = await fetch(`/worlds/${params.id}`);
	if (!res.ok) throw new Error('Failed to fetch graph data');

	const graphData: GraphData = await res.json();

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
