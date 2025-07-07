<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import cytoscape from 'cytoscape';
	import type { GraphData } from '$lib/types/graph';
	import FloatingButton from '$lib/components/FloatingButton.svelte';

	export let graphData: GraphData;

	let container: HTMLDivElement;
	let cy: cytoscape.Core;

	onMount(() => {
		cy = cytoscape({
			container,
			elements: [...graphData.nodes, ...graphData.edges],
			layout: { name: 'cose' },
			style: [
				{
					selector: 'node',
					style: {
						label: 'data(label)',
						'background-color': '#0074D9',
						color: '#fff',
						'text-valign': 'center',
						'text-halign': 'center',
						'font-size': 5
					}
				},
				{
					selector: 'edge',
					style: {
						label: 'data(label)',
						'curve-style': 'bezier',
						'target-arrow-shape': 'triangle',
						'line-color': '#ccc',
						'target-arrow-color': '#ccc',
						'font-size': 5,
						width: 2
					}
				}
			]
		});
	});

	onDestroy(() => {
		cy?.destroy();
	});

	function handleClick() {
		alert('moar multiverses');
	}
</script>

<div class="rounded-xl bg-base-300 text-base p-4 h-full w-full relative">
	<p>The multiverse exists... eventually</p>

	<div
		bind:this={container}
		style="width: 100%; height: 600px;"
		role="application"
		aria-label="Graph view"
	></div>

	<FloatingButton
		ariaLabel="moar multiverses"
		onClick={handleClick}
		position="absolute bottom-6 right-6"
	/>
</div>
