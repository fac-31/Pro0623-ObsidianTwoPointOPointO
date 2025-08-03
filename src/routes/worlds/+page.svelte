<script lang="ts">
	import { worldId } from '$lib/stores/worldId';
	import Dashboard from '$lib/components/Dashboard.svelte';
	import type { GraphData } from '$lib/types/graph';
	import { goto } from '$app/navigation';
	import { get } from 'svelte/store';
	import { activeTab } from '$lib/stores/tabs';
	import { invalidateAll } from '$app/navigation';

	export let data: { graphData: GraphData; explanation: string };

	const enterWorld = () => {
		const node = get(activeTab);
		if (node) {
			worldId.set(node.data.id);
			goto(`/worlds/${$worldId}`);
		} else {
			console.error('something went wrong');
		}
	};

	const deleteWorld = async () => {
		const node = get(activeTab);
		console.log('Active tab node:', node);
		if (node) {
			const worldNameToDelete = node.data.name;
			console.log('World name to delete:', worldNameToDelete);
			if (confirm('Are you sure you want to delete this world?')) {
				try {
					const response = await fetch(`/api/worlds/${worldNameToDelete}`,
						{
							method: 'DELETE'
						}
					);

					console.log('Delete response:', response);

					if (!response.ok) {
						const error = await response.json();
						throw new Error(error.message || 'Failed to delete world');
					}

					location.reload();
				} catch (error) {
					console.error('Error deleting world:', error);
				}
			}
		} else {
			console.error('something went wrong');
		}
	};

	const buttons = [
		{ label: 'Enter World', onClick: enterWorld, class: 'btn-primary', location: 'header' },
		{ label: 'Delete World', onClick: deleteWorld, class: 'btn-primary', location: 'header' }
	];
</script>

<Dashboard
	graphData={data.graphData}
	showSearchBar={true}
	showInfoPanelTabs={false}
	showQueryPanel={false}
	dashboardButtons={buttons}
	graphTitle="Select a world."
></Dashboard>
