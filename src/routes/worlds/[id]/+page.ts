import type { Load } from '@sveltejs/kit';
import type { GraphData } from '$lib/types/graph';

export const load: Load = async ({ fetch }) => {
	const res = await fetch(`/worlds/hello`);
	if (!res.ok) throw new Error('Failed to fetch graph data');
	console.log('hello?');

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
