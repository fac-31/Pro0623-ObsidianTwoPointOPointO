<script lang="ts">
	import type { GraphData } from '$lib/types/graph';
	import GraphView from './GraphView.svelte';
	import TextView from './TextView.svelte';
	import ToggleButton from '$lib/components/ToggleButton.svelte';

	export let data: { graphData: GraphData };

	let showGraph = true;

	function toggleView() {
		showGraph = !showGraph;
	}
</script>

<h1>Graph/Text View</h1>
<ToggleButton
	label={showGraph ? 'Switch to Text View' : 'Switch to Graph View'}
	onClick={toggleView}
/>

{#if showGraph}
	<GraphView graphData={data.graphData} />
{:else}
	<TextView graphData={data.graphData} />
{/if}
