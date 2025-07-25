<script lang="ts">
	import { onMount, onDestroy, tick } from 'svelte';
	import cytoscape from 'cytoscape';
	import type { GraphData } from '$lib/types/graph';
	import { selectedNodesStore } from '$lib/stores/selectedNodes';
	import { appSettings } from '$lib/stores/appSettings';
	import { getLayoutOptions } from '$lib/utils/cytoscape';
	import { applyCytoscapeStyle } from '$lib/utils/cytoscape';

	export let graphData: GraphData;

	let container: HTMLDivElement;
	let cy: cytoscape.Core;

	onMount(() => {
		cy = cytoscape({
			container,
			elements: [...graphData.nodes, ...graphData.edges],
			layout: getLayoutOptions($appSettings),
			wheelSensitivity: 2
		});

		let previousLayoutName = $appSettings.layoutName;
		let previousLayoutConfig = { ...$appSettings.layout[$appSettings.layoutName] };

		appSettings.subscribe(async (settings) => {
			await tick();
			const currentLayoutConfig = settings.layout[settings.layoutName];

			if (
				settings.layoutName !== previousLayoutName ||
				JSON.stringify(currentLayoutConfig) !== JSON.stringify(previousLayoutConfig)
			) {
				cy.layout(getLayoutOptions(settings)).run();
				previousLayoutName = settings.layoutName;
				previousLayoutConfig = { ...currentLayoutConfig };
			}

			applyCytoscapeStyle(cy, settings);
		});

		cy.on('tap', (event) => {
			const target = event.target;
			if (target === cy) {
				cy.elements().removeClass('selected').removeClass('faded');
				return;
			}
			if (target.isNode() || target.isEdge()) {
				selectedNodesStore.addNode({ data: target.data() });
				cy.elements().removeClass('selected').removeClass('faded');
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
