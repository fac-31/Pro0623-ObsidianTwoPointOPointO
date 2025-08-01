<script lang="ts">
	import type { GraphData, GraphNode } from '$lib/types/graph';
	import { SvelteSet } from 'svelte/reactivity';
	import TypeBox from './TypeBox.svelte';

	export let graphData: GraphData;
	let selectedNodeId: string | null = null;
	let textViewContainer: HTMLDivElement;

	const nodeTypes = Array.from(new Set(graphData.nodes.map((node) => node.data.type)));

	function getNodesByType(type: string): GraphNode[] {
		return graphData.nodes.filter((node) => node.data.type === type);
	}

	$: connectedNodeIds = (() => {
		if (!selectedNodeId) return new SvelteSet<string>();
		const connected = new SvelteSet<string>();

		for (const edge of graphData.edges) {
			if (edge.data.source === selectedNodeId) connected.add(edge.data.target);
			if (edge.data.target === selectedNodeId) connected.add(edge.data.source);
		}

		return connected;
	})();

	// Connected neighbors and their relationship info
	type NeighborWithRelation = {
		node: GraphNode;
		relationship: {
			id: string;
			label: string;
			properties: Record<string, any>;
		};
	};

	$: neighborsWithRelations = (() => {
		if (!selectedNodeId) return [];

		const connected: NeighborWithRelation[] = [];

		for (const edge of graphData.edges) {
			let neighborId: string | null = null;

			if (edge.data.source === selectedNodeId) {
				neighborId = edge.data.target;
			} else if (edge.data.target === selectedNodeId) {
				neighborId = edge.data.source;
			}

			if (neighborId) {
				const neighborNode = graphData.nodes.find((n) => n.data.id === neighborId);
				if (neighborNode) {
					connected.push({
						node: neighborNode,
						relationship: {
							id: edge.data.id,
							label: edge.data.label,
							properties: edge.data
						}
					});
				}
			}
		}

		return connected;
	})();
</script>

<div
	data-testid="text-view"
	role="presentation"
	aria-hidden="true"
	class="flex flex-wrap justify-center items-start gap-6 p-4 overflow-y-auto max-h-[calc(100vh-4rem)] mt-10"
	bind:this={textViewContainer}
>
	{#each nodeTypes as type (type)}
		<TypeBox
			title={type}
			nodes={getNodesByType(type)}
			{selectedNodeId}
			{connectedNodeIds}
			{neighborsWithRelations}
			onSelect={(id) => (selectedNodeId = id)}
		/>
	{/each}
</div>
