<svelte:head>
	<title>{data.graphTitle}</title>
</svelte:head>

<script lang="ts">
	import Dashboard from '$lib/components/Dashboard.svelte';
	import type { GraphData, WorldInfo } from '$lib/types/graph';

	export let data: { graphData: GraphData; graphTitle: string; worldInfo?: WorldInfo };
</script>

<Dashboard graphData={data.graphData} graphTitle={data.graphTitle} worldInfo={data.worldInfo}
></Dashboard>
