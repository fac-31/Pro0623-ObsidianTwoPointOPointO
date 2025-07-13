<script lang="ts">
	import type { GraphData } from '$lib/types/graph';
	import GraphView from './GraphView.svelte';
	import TextView from './TextView.svelte';
	import FloatingButton from '$lib/components/FloatingButton.svelte';

	let showGraph = true;

	function handleClick() {
		showGraph = !showGraph;
	}

	export let graphData: GraphData;
</script>

<div class="flex flex-col h-full w-full rounded-xl bg-base-300 relative">
	<div class="flex-1 overflow-hidden">
		{#if showGraph}
			<GraphView {graphData} />
		{:else}
			<TextView {graphData} />
		{/if}
	</div>

	<FloatingButton
		ariaLabel="toggle view"
		onClick={handleClick}
		position="absolute bottom-6 right-6"
	/>
</div>
