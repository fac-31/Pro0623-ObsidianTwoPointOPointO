<script lang="ts">
	import { worldId } from '$lib/stores/worldId';
	import Dashboard from '$lib/components/Dashboard.svelte';
	import type { GraphData, WorldInfo } from '$lib/types/graph';
	export let data: { graphData: GraphData; graphTitle: string; worldInfo?: WorldInfo };

	const onClick = () => {
		console.log('edit');
	};

	const editButton = [{ label: 'Edit', onClick, class: 'btn-primary' }];
</script>

<Dashboard
	worldId={$worldId}
	graphData={data.graphData}
	graphTitle={data.graphTitle}
	worldInfo={data.worldInfo}
	dashboardButtons={editButton}
></Dashboard>
