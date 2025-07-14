<script lang="ts">
	import type { GraphData } from '$lib/types/graph';
	import GraphView from './GraphView.svelte';
	import TextView from './TextView.svelte';
	import FloatingButton from './FloatingButton.svelte';
	import { createEventDispatcher } from 'svelte';

	export let graphData: GraphData;
	export let showGraph: boolean;

	const dispatch = createEventDispatcher();

	function createNew() {
		dispatch('createNew');
	}

	function displayText() {
		dispatch('displayText');
	}
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
		onCreateNew={createNew}
		onDisplayText={displayText}
		position="absolute bottom-6 right-6"
	/>
</div>
