<script lang="ts">
	import { worldId } from '$lib/stores/worldId';
	import Dashboard from '$lib/components/Dashboard.svelte';
	import type { GraphData } from '$lib/types/graph';
	import { goto } from '$app/navigation';
	import { get } from 'svelte/store';
	import { activeNode } from '$lib/stores/selectedNodes';

	export let data: { graphData: GraphData; explanation: string };

	const enterWorld = () => {
		const node = get(activeNode);
		if (node) {
			worldId.set(node.data.id);
			goto(`/worlds/${$worldId}`);
		} else {
			console.error('something went wrong');
		}
	};

	const enterWorldButton = [{ label: 'Enter World', onClick: enterWorld, class: 'btn-primary' }];
</script>

<Dashboard
	graphData={data.graphData}
	showSearchBar={true}
	showInfoPanelTabs={false}
	showQueryPanel={false}
	dashboardButtons={enterWorldButton}
	graphTitle="Select a world."
></Dashboard>
