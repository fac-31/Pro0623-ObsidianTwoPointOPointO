<script lang="ts">
	import Dashboard from '$lib/components/Dashboard.svelte';
	import type { GraphData } from '$lib/types/graph';

	export let data: { graphData: GraphData };
</script>

<Dashboard
	graphData={data.graphData}
	showSearchBar={true}
	showInfoPanelTabs={false}
	showQueryPanel={false}
></Dashboard>
