<script lang="ts">
	import type { GraphData, GraphNode } from '$lib/types/graph';
	export let graphData: GraphData;

	let selectedNodeId: string | null = null;

	function getNodesByType(type: string): GraphNode[] {
		return graphData.nodes.filter((node) => node.data.type === type);
	}

	function addFilter(event: MouseEvent & { currentTarget: EventTarget & HTMLButtonElement }) {
		const label = event.currentTarget.textContent?.trim();
		const node = graphData.nodes.find((n) => n.data.label === label || n.data.name === label);

		if (node) {
			selectedNodeId = node.data.id;
		} else {
			selectedNodeId = null;
		}
	}

	function getConnectedNodeIds(): Set<string> {
		if (!selectedNodeId) return new Set();

		const connectedIds = new Set<string>();
		for (const edge of graphData.edges) {
			if (edge.data.source === selectedNodeId) {
				connectedIds.add(edge.data.target);
			}
			if (edge.data.target === selectedNodeId) {
				connectedIds.add(edge.data.source);
			}
		}
		return connectedIds;
	}
</script>

<div class="m-2">
	<div class="badge badge-outline">Outline</div>
</div>

<!-- Flex container to arrange boxes in a row that wraps and centers -->
<div class="flex flex-wrap justify-center gap-6 p-4 overflow-y-auto max-h-[calc(100vh-4rem)]">
	<!-- Locations Box -->
	<section class="border rounded p-4 bg-white shadow w-64">
		<h2 class="text-lg font-semibold mb-2">Locations</h2>
		{#if getNodesByType('Location').length > 0}
			<ul class="flex flex-wrap gap-2">
				{#each getNodesByType('Location') as node}
					<button
						class="btn m-1
              {selectedNodeId === node.data.id ? 'bg-blue-500 text-white' : ''}
              {selectedNodeId &&
						getConnectedNodeIds().has(node.data.id) &&
						selectedNodeId !== node.data.id
							? 'bg-blue-100'
							: ''}"
						on:click={addFilter}
					>
						{node.data.label ?? node.data.name}
					</button>
				{/each}
			</ul>
		{:else}
			<p class="italic text-gray-400">No locations available</p>
		{/if}
	</section>

	<!-- Events Box -->
	<section class="border rounded p-4 bg-white shadow w-64">
		<h2 class="text-lg font-semibold mb-2">Events</h2>
		{#if getNodesByType('Event').length > 0}
			<ul class="flex flex-wrap gap-2">
				{#each getNodesByType('Event') as node}
					<button
						class="btn m-1
              {selectedNodeId === node.data.id ? 'bg-blue-500 text-white' : ''}
              {selectedNodeId &&
						getConnectedNodeIds().has(node.data.id) &&
						selectedNodeId !== node.data.id
							? 'bg-blue-100'
							: ''}"
						on:click={addFilter}
					>
						{node.data.label ?? node.data.name}
					</button>
				{/each}
			</ul>
		{:else}
			<p class="italic text-gray-400">No events available</p>
		{/if}
	</section>

	<!-- Characters Box -->
	<section class="border rounded p-4 bg-white shadow w-64">
		<h2 class="text-lg font-semibold mb-2">Characters</h2>
		{#if getNodesByType('Character').length > 0}
			<ul class="flex flex-wrap gap-2">
				{#each getNodesByType('Character') as node}
					<button
						class="btn m-1
              {selectedNodeId === node.data.id ? 'bg-blue-500 text-white' : ''}
              {selectedNodeId &&
						getConnectedNodeIds().has(node.data.id) &&
						selectedNodeId !== node.data.id
							? 'bg-blue-100'
							: ''}"
						on:click={addFilter}
					>
						{node.data.label ?? node.data.name}
					</button>
				{/each}
			</ul>
		{:else}
			<p class="italic text-gray-400">No characters available</p>
		{/if}
	</section>
</div>
