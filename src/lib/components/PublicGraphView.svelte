<script lang="ts">
	import SearchBar from './SearchBar.svelte';
	import GraphView from './GraphView.svelte';
	import type { GraphData } from '$lib/types/graph';
	import TopNavBar from './TopNavBar.svelte';

	export let graphData: GraphData;
</script>

<div class="w-screen h-screen flex flex-col">
	<TopNavBar>
		<SearchBar />
	</TopNavBar>
	<div class="flex-1 overflow-hidden">
		<GraphView {graphData} />
	</div>
</div>