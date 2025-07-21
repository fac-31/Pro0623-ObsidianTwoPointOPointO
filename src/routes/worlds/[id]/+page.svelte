<script lang="ts">
	import Dashboard from '$lib/components/Dashboard.svelte';
	import type { GraphData, WorldInfo } from '$lib/types/graph';

	const worldId = localStorage.get('worldId');
	export let data: { graphData: GraphData; graphTitle: string; worldInfo?: WorldInfo };
</script>

<Dashboard
	{worldId}
	graphData={data.graphData}
	graphTitle={data.graphTitle}
	worldInfo={data.worldInfo}
></Dashboard>
