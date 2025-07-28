<script lang="ts">
	import { page } from '$app/stores';
	import Dashboard from '$lib/components/Dashboard.svelte';
	import type { GraphData, WorldInfo } from '$lib/types/graph';
	export let data: { graphData: GraphData; graphTitle: string; worldInfo?: WorldInfo };

	// Get the world ID directly from the URL parameters. This is the reliable SvelteKit way.
	const worldId = $page.params.id;
	console.log('pageworldsId', worldId);
</script>

<Dashboard
	{worldId}
	graphData={data.graphData}
	graphTitle={data.graphTitle}
	worldInfo={data.worldInfo}
></Dashboard>
