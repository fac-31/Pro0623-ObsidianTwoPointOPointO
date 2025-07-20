<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import cytoscape from 'cytoscape';
	import type { GraphData } from '$lib/types/graph';
	import { registerNodeClickEvents } from '$lib/utils/graphClickHandler';

	export let graphData: GraphData;

	let container: HTMLDivElement;
	let cy: cytoscape.Core;

	onMount(() => {
		cy = cytoscape({
			container,
			elements: [...graphData.nodes, ...graphData.edges],
			layout: { name: 'cose' },
			wheelSensitivity: 2,
			style: [
				{
					selector: 'node',
					style: {
						label: 'data(name)',
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
				},
				{
					selector: 'node.selected',
					style: {
						'background-color': '#FF4136'
					}
				}
			]
		});

		registerNodeClickEvents(cy);
	});

	onDestroy(() => {
		cy?.destroy();
	});
</script>

<div class="h-full w-full flex flex-col min-h-0">
	<div bind:this={container} class="h-full w-full" role="application" aria-label="Graph view"></div>
</div>
