<script lang="ts">
	import Dashboard from '$lib/components/Dashboard.svelte';
	import type { GraphData } from '$lib/types/graph';

	export let data: { graphData: GraphData };

	const enterWorldButton = [
		{ label: 'Enter World', onClick: () => alert('Entering World!'), class: 'btn-primary' }
	];
</script>

<Dashboard
	graphData={data.graphData}
	showSearchBar={true}
	showInfoPanelTabs={false}
	showQueryPanel={false}
	dashboardButtons={enterWorldButton}
></Dashboard>