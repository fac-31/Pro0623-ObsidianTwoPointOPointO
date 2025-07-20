<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import cytoscape from 'cytoscape';
	import type { GraphData } from '$lib/types/graph';
	import { selectedNodesStore } from '$lib/stores/selectedNodes';
	import { appSettings } from '$lib/stores/appSettings';
	import { formatHex, oklch } from 'culori';

	export let graphData: GraphData;

	let container: HTMLDivElement;
	let cy: cytoscape.Core;

	const getResolvedColor = (className: string): string => {
		const el = document.createElement('div');
		el.className = `${className} fixed -top-[9999px] w-0 h-0`;
		document.body.appendChild(el);

		const color = getComputedStyle(el).backgroundColor;

		document.body.removeChild(el);
		return formatHex(oklch(color));
	};

	function applyCytoscapeStyle(settings: typeof $appSettings) {
		if (!cy) return;

		// Resolve colors dynamically based on the current DaisyUI theme
		const primaryColor = getResolvedColor('bg-primary');
		const primaryContentColor = getResolvedColor('bg-primary-content');

		const secondaryColor = getResolvedColor('bg-secondary');
		const secondaryContentColor = getResolvedColor('bg-secondary-content');

		const accentColor = getResolvedColor('bg-accent');
		const accentContentColor = getResolvedColor('bg-accent-content');

		const neutralColor = getResolvedColor('bg-neutral');
		const neutralContentColor = getResolvedColor('bg-neutral-content');

		const base100Color = getResolvedColor('bg-base-100');
		const base200Color = getResolvedColor('bg-base-200');
		const base300Color = getResolvedColor('bg-base-300');
		const baseContentColor = getResolvedColor('bg-base-content');

		const infoColor = getResolvedColor('bg-info');
		const infoContentColor = getResolvedColor('bg-info-content');
		const successColor = getResolvedColor('bg-success');
		const successContentColor = getResolvedColor('bg-success-content');
		const warningColor = getResolvedColor('bg-warning');
		const warningContentColor = getResolvedColor('bg-warning-content');
		const errorColor = getResolvedColor('bg-error');
		const errorContentColor = getResolvedColor('bg-error-content');

		cy.style()
			.resetToDefault()
			.selector('node')
			.style({
				label: 'data(label)',
				'background-color': neutralColor, // node colour
				color: neutralContentColor, //text colour
				'text-background-color': secondaryColor,
				'text-valign': 'center',
				'text-halign': 'center',
				'font-size': settings.nodeFontSize,
				opacity: settings.nodeOpacity,
				'border-width': settings.nodeBorderWidth,
				'text-wrap': 'wrap',
				'text-max-width': settings.nodeTextMaxWidth,
				'text-background-opacity': 1,
				'text-background-padding': settings.nodeTextBackgroundPadding
			})
			.selector('edge')
			.style({
				label: 'data(label)',
				'curve-style': 'bezier',
				'target-arrow-shape': 'triangle',
				'line-color': neutralColor,
				'target-arrow-color': neutralColor,
				color: accentColor, // line colour
				'text-rotation': 'autorotate',
				'font-size': settings.edgeFontSize,
				width: settings.edgeWidth,
				'text-wrap': 'wrap',
				'text-max-width': settings.edgeTextMaxWidth
			})
			.selector('.faded')
			.style({
				opacity: 0.1
			})
			.selector('node:selected')
			.style({
				'border-width': settings.selectedNodeBorderWidth,
				'border-color': accentColor,
				'border-opacity': 1,
				'font-size': settings.selectedNodeFontSize
			})
			.selector('edge:selected')
			.style({
				'line-color': accentColor,
				'target-arrow-color': accentColor,
				width: settings.selectedEdgeWidth
			})
			.update();
	}

	onMount(() => {
		cy = cytoscape({
			container,
			elements: [...graphData.nodes, ...graphData.edges],
			layout: { name: 'cose' },
			wheelSensitivity: 2
		});

		// Subscribe to appSettings store and apply styles on change
		appSettings.subscribe((settings) => {
			applyCytoscapeStyle(settings);
		});

		// Handle interactions
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

	onDestroy(() => {
		cy?.destroy();
	});
</script>

<div class="h-full w-full flex flex-col min-h-0">
	<!-- Graph container -->
	<div bind:this={container} class="h-full w-full" role="application" aria-label="Graph view"></div>
</div>
