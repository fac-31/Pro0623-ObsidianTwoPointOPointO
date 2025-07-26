<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import cytoscape from 'cytoscape';
	import type { GraphData } from '$lib/types/graph';
	import { selectedNodesStore } from '$lib/stores/selectedNodes';

	export let graphData: GraphData;

	graphData.nodes = graphData.nodes.map((node) => ({
		...node,
		data: {
			...node.data,
			label: node.data.name,
			size: `${Math.max(40, node.data.name.length * 7)}`
		}
	}));

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
						'text-wrap': 'wrap',
						'text-max-width': '100',
						'background-color': 'black',
						color: 'white',
						'text-valign': 'center',
						'text-halign': 'center',
						'font-size': 15,
						'font-family': 'Orbitron, sans serif',
						'font-weight': 400,
						'text-outline-color': 'gray',
						'text-outline-width': 0.6,
						'border-width': 3,
						'border-color': 'white',
						width: '100',
						height: '100',
						padding: '10px',
						shape: 'ellipse'
					}
				},
				{
					selector: 'node[type = "Character"]',
					style: {
						color: '#cae9fc',
						'text-outline-color': '#32a6ed',
						'border-color': '#cae9fc'
					}
				},
				{
					selector: 'node[type = "Event"]',
					style: {
						color: '#fab9ec',
						'text-outline-color': '#e324ba',
						'border-color': '#fab9ec'
					}
				},

				{
					selector: 'edge',
					style: {
						label: 'data(name)',
						'curve-style': 'bezier',
						'target-arrow-shape': 'triangle',
						'line-color': '#dcd6d7',
						'target-arrow-color': '#dcd6d7',
						color: '#dcd6d7',
						'text-rotation': 'autorotate',
						'text-wrap': 'wrap',
						'text-max-width': '80px',
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
						'border-color': '#ff6c7e',
						'border-opacity': 1
					}
				}
			]
		});

		cy.on('tap', (event) => {
			const target = event.target;

			// Tapped on background
			if (target === cy) {
				// Keeping tabs open, but visually deselecting
				cy.nodes().removeClass('selected');
				cy.elements().removeClass('faded');
				return;
			}

			// Tapped on a node
			if (target.isNode && target.isNode()) {
				console.log('Node data:', target.data());
				selectedNodesStore.addNode({ data: target.data() });

				cy.nodes().removeClass('selected');
				cy.elements().removeClass('faded');

				target.addClass('selected');
				const connected = target.closedNeighborhood();
				cy.elements().difference(connected).addClass('faded');
			}
		});
	});

	$: if (cy && graphData) {
		cy.elements().remove();
		cy.add([...graphData.nodes, ...graphData.edges]);
		cy.layout({ name: 'cose' }).run();
		console.log('Graph data updated', graphData.nodes.length, graphData.edges.length);
	}

	onDestroy(() => {
		cy?.destroy();
	});
</script>

<div class="h-full w-full flex flex-col min-h-0">
	<div bind:this={container} class="h-full w-full" role="application" aria-label="Graph view"></div>
</div>
