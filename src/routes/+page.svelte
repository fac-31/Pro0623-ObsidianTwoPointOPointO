<script lang="ts">
	import PublicGraphView from '$lib/components/PublicGraphView.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<PublicGraphView graphData={data.graphData} />
