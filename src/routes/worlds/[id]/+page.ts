import type { Load } from '@sveltejs/kit';
import type { GraphData } from '$lib/types/graph';

export const load: Load = async ({ params, fetch }) => {
	const res = await fetch(`/worlds/${params.id}`);
	if (!res.ok) throw new Error('Failed to fetch graph data');

	const graphData: GraphData = await res.json();

	graphData.nodes = graphData.nodes.map((node) => ({
		...node,
		data: {
			...node.data,
			label: node.data.name || node.data.title || 'Untitled'
		}
	}));

	return { graphData };
};
