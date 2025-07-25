<script lang="ts">
	import type { GraphData, GraphNode } from '$lib/types/graph';
	import { SvelteSet } from 'svelte/reactivity';
	import TypeBox from './TypeBox.svelte';

	export let graphData: GraphData;
	let selectedNodeId: string | null = null;

	const nodeTypes = Array.from(new Set(graphData.nodes.map((node) => node.data.type)));

	function getNodesByType(type: string): GraphNode[] {
		return graphData.nodes.filter((node) => node.data.type === type);
	}

	function handleClickOutside(event: MouseEvent) {
		if (!(event.target as HTMLElement).closest('button')) {
			selectedNodeId = null;
		}
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
</script>

<div
	role="presentation"
	aria-hidden="true"
	class="flex flex-wrap justify-center gap-6 p-4 overflow-y-auto max-h-[calc(100vh-4rem)] mt-10"
	onclick={handleClickOutside}
>
	{#each nodeTypes as type (type)}
		{console.log(type)}
		<TypeBox
			title={type}
			nodes={getNodesByType(type)}
			{selectedNodeId}
			{connectedNodeIds}
			onSelect={(id) => (selectedNodeId = id)}
		/>
	{/each}
</div>
