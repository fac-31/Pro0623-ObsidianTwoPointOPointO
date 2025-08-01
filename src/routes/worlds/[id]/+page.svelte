<script lang="ts">
	import { worldId } from '$lib/stores/worldId';
	import Dashboard from '$lib/components/Dashboard.svelte';
	import type { GraphData, WorldInfo } from '$lib/types/graph';
	import { tabsStore, activeTab } from '$lib/stores/tabs';

	export let data: { graphData: GraphData; graphTitle: string; worldInfo?: WorldInfo };

	let editedContent: string | undefined;

	function handleEditClick() {
		if ($activeTab) {
			tabsStore.setTabEditing($activeTab.data.id, true);
			editedContent = $activeTab.data.content;
		}
	}

	async function handleSaveClick() {
		if ($activeTab) {
			tabsStore.updateTabContent($activeTab.data.id, editedContent);
			tabsStore.setTabEditing($activeTab.data.id, false);

			await fetch('/api/update-node', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					name: $activeTab.data.label,
					content: editedContent
				})
			});
		}
	}

	function handleCancelClick() {
		if ($activeTab) {
			tabsStore.setTabEditing($activeTab.data.id, false);
		}
	}

	$: dashboardButtons = [
		{ label: 'Edit', onClick: handleEditClick, class: 'btn-primary', location: 'header' },
		{ label: 'Save', onClick: handleSaveClick, class: 'btn-primary', location: 'content' },
		{ label: 'Cancel', onClick: handleCancelClick, class: 'btn-ghost', location: 'content' }
	];
</script>

<Dashboard
	{...data}
	worldId={$worldId}
	graphData={data.graphData}
	graphTitle={data.graphTitle}
	worldInfo={data.worldInfo}
	{dashboardButtons}
	bind:editedContent
></Dashboard>
