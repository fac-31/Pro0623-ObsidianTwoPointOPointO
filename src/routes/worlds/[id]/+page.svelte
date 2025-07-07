<script lang="ts">
	import Grid from '$lib/components/Dashboard.svelte';
	import type { GraphData } from '$lib/types/graph';

	export let data: { graphData: GraphData };
</script>

<Grid graphData={data.graphData}></Grid>
