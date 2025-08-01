<script lang="ts">
	import { onMount, onDestroy, tick } from 'svelte';
	import cytoscape from 'cytoscape';
	import type { GraphData } from '$lib/types/graph';
	import { tabsStore } from '$lib/stores/tabs';
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

			// Tapping background clears selection
			if (target === cy) {
				cy.elements().removeClass('selected').removeClass('faded');
				return;
			}

			// Tapping a node: highlight and add to store
			if (target.isNode()) {
				console.log(target.data());
				tabsStore.addTab({ data: target.data() });
				cy.elements().removeClass('selected').removeClass('faded');
				target.addClass('selected');
				const connected = target.closedNeighborhood();
				cy.elements().difference(connected).addClass('faded');
			}

			// Tapping an edge: highlight only
			if (target.isEdge()) {
				cy.elements().removeClass('selected').removeClass('faded');
				target.addClass('selected');
				const connected = target.connectedNodes();
				cy.elements().difference(connected.union(target)).addClass('faded');
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
