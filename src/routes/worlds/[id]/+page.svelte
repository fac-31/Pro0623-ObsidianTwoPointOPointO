<script lang="ts">
	import { worldId } from '$lib/stores/worldId';
	import Dashboard from '$lib/components/Dashboard.svelte';
	import type { GraphData, WorldInfo } from '$lib/types/graph';
	export let data: { graphData: GraphData; graphTitle: string; worldInfo?: WorldInfo };

	import { page } from '$app/state';

	const buildWorld = async () => {
		console.log('Building world with ID:', page.params.id);
		try {
			const response = await fetch(`/worlds/id`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ worldId: page.params.id })
			});
			if (!response.ok) {
				throw new Error('Failed to build world');
			}
			const result = await response.json();
			console.log('World built successfully:', result);
		} catch (error) {
			console.error('Error building world:', error);
		}
	};

	const buildWorldAPI = async () => {
		console.log('Building world with ID (API):', page.params.id);
		try {
			const response = await fetch(`/api/build`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ worldId: page.params.id })
			});
			if (!response.ok) {
				throw new Error('Failed to build world');
			}
			const result = await response.json();
			console.log('World built successfully:', result);
		} catch (error) {
			console.error('Error building world:', error);
		}
	};
</script>

<Dashboard
	worldId={$worldId}
	graphData={data.graphData}
	graphTitle={data.graphTitle}
	worldInfo={data.worldInfo}
></Dashboard>
