<script lang="ts">
	import SearchBar from './SearchBar.svelte';
	import GraphView from './GraphView.svelte';
	import type { GraphData } from '$lib/types/graph';

	export let graphData: GraphData;
</script>

<div class="w-screen h-screen flex flex-col">
	<SearchBar />
	<div class="flex-1">
		<GraphView {graphData} />
	</div>
</div>
