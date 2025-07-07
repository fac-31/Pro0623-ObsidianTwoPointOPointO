<script lang="ts">
	import GraphView from './GraphView.svelte';
	import TextView from './TextView.svelte';
	import FloatingButton from '$lib/components/FloatingButton.svelte';

	let showGraph = true;

	function handleClick() {
		showGraph = !showGraph;
	}

	export let graphData;
</script>

<div class="rounded-xl bg-base-300 text-base p-4 h-full w-full relative">
	{#if showGraph}
		<GraphView {graphData} />
	{:else}
		<TextView {graphData} />
	{/if}

	<FloatingButton
		ariaLabel="toggle view"
		onClick={handleClick}
		position="absolute bottom-6 right-6"
	/>
</div>
