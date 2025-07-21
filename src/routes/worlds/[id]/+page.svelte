<script lang="ts">
	import Dashboard from '$lib/components/Dashboard.svelte';
	import type { GraphData, WorldInfo } from '$lib/types/graph';

	let worldName: string = 'Luminwood Realm';
	export let data: { graphData: GraphData; graphTitle: string; worldInfo?: WorldInfo };
</script>

<Dashboard
	{worldName}
	graphData={data.graphData}
	graphTitle={data.graphTitle}
	worldInfo={data.worldInfo}
></Dashboard>
