<script>
	import WorldView from './WorldView.svelte';
	import QueryPanel from './QueryPanel.svelte';
	import InfoPanel from './InfoPanel.svelte';
	//import TopNavBar from './TopNavBar.svelte';

	export let graphData;
</script>

<div class="grid grid-cols-[2fr_1fr] grid-rows-[1fr_2fr] gap-4 h-screen p-4">
	<!--<div aria-label="Navigation"><TopNavBar /></div>-->
	<div aria-label="Nodes" class="row-span-2"><WorldView {graphData} /></div>
	<div aria-label="Query panel"><QueryPanel /></div>
	<div aria-label="Information Panel"><InfoPanel /></div>
	<slot></slot>
</div>
