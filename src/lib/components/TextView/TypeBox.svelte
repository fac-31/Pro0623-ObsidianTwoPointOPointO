<script lang="ts">
	import type { GraphNode } from '$lib/types/graph';
	import type { SvelteSet } from 'svelte/reactivity';
	import { tabsStore } from '$lib/stores/tabs';

	export let title: string;
	export let nodes: GraphNode[];
	export let selectedNodeId: string | null;
	export let connectedNodeIds: SvelteSet<string>;
	export let neighborsWithRelations: {
		node: GraphNode;
		relationship: {
			id: string;
			label: string;
			properties: Record<string, any>;
		};
	}[];
	export let onSelect: (id: string | null) => void;

	function handleClick(node: GraphNode) {
		if (node.data.id === selectedNodeId) {
			onSelect(null);
		} else {
			onSelect(node.data.id);
			tabsStore.addTab(node);
		}
	}
</script>

<section class="border rounded p-4 shadow w-64 bg-base-100">
	<h2 class="text-lg font-semibold mb-2">{title}</h2>
	{#if nodes.length > 0}
		<ul class="flex flex-col gap-2">
			{#each nodes as node (node.data.id)}
				<div class="flex flex-col w-full">
					<button
						class="btn btn-outline w-full text-left
							{selectedNodeId === node.data.id ? 'bg-primary text-primary-content' : ''}
							{selectedNodeId && connectedNodeIds.has(node.data.id) && selectedNodeId !== node.data.id
							? 'bg-base-300'
							: ''}"
						on:click={() => handleClick(node)}
					>
						{node.data.label ?? node.data.name}
					</button>

					{#if selectedNodeId && connectedNodeIds.has(node.data.id) && selectedNodeId !== node.data.id}
						{#each neighborsWithRelations.filter((nr) => nr.node.data.id === node.data.id) as relation}
							<div class="text-sm mt-1 ml-2 p-2 bg-base-200 rounded">
								<span class="font-semibold">{relation.relationship.label}</span>
								{#if Object.keys(relation.relationship.properties).length > 0}
									<ul class="text-xs mt-1 list-disc list-inside">
										{#each Object.entries(relation.relationship.properties) as [key, value]}
											{#if !['id', 'source', 'target', 'label'].includes(key)}
												<li><strong>{key}:</strong> {value}</li>
											{/if}
										{/each}
									</ul>
								{/if}
							</div>
						{/each}
					{/if}
				</div>
			{/each}
		</ul>
	{:else}
		<p class="italic text-gray-400">No {title.toLowerCase()} available</p>
	{/if}
</section>
