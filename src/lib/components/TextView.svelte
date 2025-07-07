<script lang="ts">
	import type { GraphData, GraphNode, GraphEdge } from '$lib/types/graph';
	import './TextView.css';

	export let graphData: GraphData;

	let selectedNodeId: string = graphData.nodes[0]?.data.id ?? '';

	function getNode(id: string): GraphNode | undefined {
		return graphData.nodes.find((n) => n.data.id === id);
	}

	function getIncoming(nodeId: string): GraphEdge[] {
		return graphData.edges.filter((e) => e.data.target === nodeId);
	}

	function getOutgoing(nodeId: string): GraphEdge[] {
		return graphData.edges.filter((e) => e.data.source === nodeId);
	}

	function selectNode(id: string) {
		selectedNodeId = id;
	}
</script>

<div class="container">
	<div class="ascii-tree" role="tree" aria-label="Graph Text View">
		{#if selectedNodeId}
			<!-- Incoming nodes and connection lines without blank lines -->
			{#each getIncoming(selectedNodeId) as edge, i (edge.data.id)}
				<button
					class="node-button incoming-node"
					tabindex="0"
					on:click={() => selectNode(edge.data.source)}
					on:keydown={(e) => e.key === 'Enter' && selectNode(edge.data.source)}
					aria-label={`Select node ${getNode(edge.data.source)?.data.label}`}
					aria-selected="false"
					role="treeitem"
				>
					{getNode(edge.data.source)?.data.label}
				</button>

				<div class="connection-line incoming-line">
					└──[{edge.data.label}]──&gt;
					{#if i === getIncoming(selectedNodeId).length - 1}
						<span class="selected-node">{getNode(selectedNodeId)?.data.label}</span>
					{/if}
				</div>
			{/each}

			<!-- Add a blank line only between incoming and outgoing sections -->
			{#if getIncoming(selectedNodeId).length > 0 && getOutgoing(selectedNodeId).length > 0}
				<div class="blank-line"></div>
			{/if}

			<!-- Outgoing nodes -->
			{#each getOutgoing(selectedNodeId) as edge, i (edge.data.id)}
				<div class="connection-line outgoing-line">
					└──[{edge.data.label}]──&gt;
				</div>
				<button
					class="node-button outgoing-node"
					tabindex="0"
					on:click={() => selectNode(edge.data.target)}
					on:keydown={(e) => e.key === 'Enter' && selectNode(edge.data.target)}
					aria-label={`Select node ${getNode(edge.data.target)?.data.label}`}
					aria-selected="false"
					role="treeitem"
				>
					{getNode(edge.data.target)?.data.label}
				</button>

				{#if i < getOutgoing(selectedNodeId).length - 1}
					<div class="blank-line"></div>
				{/if}
			{/each}
		{/if}
	</div>

	<aside class="properties-box" aria-label="Selected node properties">
		<h2>Selected Node Properties</h2>
		{#if selectedNodeId}
			<ul>
				{#each Object.entries(getNode(selectedNodeId)?.data ?? {}) as [key, value]}
					<li><strong>{key}:</strong> {value}</li>
				{/each}
			</ul>
		{/if}
	</aside>
</div>
