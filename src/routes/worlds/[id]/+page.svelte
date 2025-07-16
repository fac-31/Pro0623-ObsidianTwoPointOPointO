<script lang="ts">
	import Dashboard from '$lib/components/Dashboard.svelte';
	import type { GraphData } from '$lib/types/graph';

	let worldName: string = 'Luminwood Realm';
	export let data: { graphData: GraphData };
</script>

<Dashboard {worldName} graphData={data.graphData}></Dashboard>
