<script lang="ts">
	import type { GraphNode } from '$lib/types/graph';
	import type { SvelteSet } from 'svelte/reactivity';
	import { selectedNodesStore } from '$lib/stores/selectedNodes';

	export let title: string;
	export let nodes: GraphNode[];
	export let selectedNodeId: string | null;
	export let connectedNodeIds: SvelteSet<string>;
	export let onSelect: (id: string | null) => void;

	function handleClick(node: GraphNode) {
		if (node.data.id === selectedNodeId) {
			onSelect(null);
		} else {
			onSelect(node.data.id);
			selectedNodesStore.addNode(node);
		}
	}
</script>

<section class="border rounded p-4 shadow w-64 bg-base-100">
	<h2 class="text-lg font-semibold mb-2">{title}</h2>
	{#if nodes.length > 0}
		<ul class="flex flex-wrap gap-2">
			{#each nodes as node (node.data.id)}
				<button
					class="btn btn-outline
            {selectedNodeId === node.data.id ? 'bg-primary text-primary-content' : ''}
            {selectedNodeId && connectedNodeIds.has(node.data.id) && selectedNodeId !== node.data.id
						? 'bg-base-300'
						: ''}"
					onclick={() => handleClick(node)}
				>
					{node.data.label ?? node.data.name}
				</button>
			{/each}
		</ul>
	{:else}
		<p class="italic text-gray-400">No {title.toLowerCase()} available</p>
	{/if}
</section>
