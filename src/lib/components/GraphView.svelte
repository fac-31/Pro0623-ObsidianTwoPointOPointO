<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import cytoscape from 'cytoscape';
	import type { GraphData } from '$lib/types/graph';
	import { selectedNode } from '$lib/stores/selectedNode';

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
						label: 'data(label)',
						'background-color': '#666666',
						color: '#fff',
						'text-valign': 'center',
						'text-halign': 'center',
						'font-size': 5,
						opacity: 1,
						'border-width': 0
					}
				},
				{
					selector: 'edge',
					style: {
						label: 'data(label)',
						'curve-style': 'bezier',
						'target-arrow-shape': 'triangle',
						'line-color': '#000', // Black edge line
						'target-arrow-color': '#000', // Black arrow
						color: '#fff', // White text label
						'text-rotation': 'autorotate', // Label follows edge angle
						'text-wrap': 'wrap',
						'text-max-width': '80px',
						'font-size': 3,
						width: 2
					}
				},
				{
					selector: '.faded',
					style: {
						opacity: 0.1
					}
				},
				{
					selector: '.selected',
					style: {
						'border-width': 1,
						'border-color': '#143261',
						'border-opacity': 1,
						'font-size': 6
					}
				}
			]
		});

		cy.on('tap', (event) => {
			const target = event.target;

			// Tapped on background
			if (target === cy) {
				selectedNode.set(null);
				cy.nodes().removeClass('selected');
				cy.elements().removeClass('faded');
				return;
			}

			// Tapped on a node
			if (target.isNode && target.isNode()) {
				console.log('Node data:', target.data());
				selectedNode.set({ data: target.data() });

				cy.nodes().removeClass('selected');
				cy.elements().removeClass('faded');

				target.addClass('selected');
				const connected = target.closedNeighborhood();
				cy.elements().difference(connected).addClass('faded');
			}
		});
	});

	onDestroy(() => {
		cy?.destroy();
	});
</script>

<div class="h-full w-full flex flex-col min-h-0">
	<div bind:this={container} class="h-full w-full" role="application" aria-label="Graph view"></div>
</div>
