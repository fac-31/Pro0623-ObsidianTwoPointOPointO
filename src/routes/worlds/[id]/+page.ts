import type { Load } from '@sveltejs/kit';
import type { GraphData } from '$lib/types/graph';

export const load: Load = async ({ params, fetch }) => {
	const res = await fetch(`/worlds/${params.id}`);
	const postRes = await fetch(`/worlds/${params.id}`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		}
	});
	if (!res.ok) throw new Error('Failed to fetch graph data');
	if (postRes.ok) {
		const data = await postRes.json();
		console.log(data.message);
	}

	const graphData: GraphData = await res.json();

	graphData.nodes = graphData.nodes.map((node) => ({
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
