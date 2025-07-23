<script lang="ts">
	import { onMount, onDestroy, tick } from 'svelte';
	import cytoscape from 'cytoscape';
	import type { GraphData } from '$lib/types/graph';
	import { selectedNodesStore } from '$lib/stores/selectedNodes';
	import { appSettings } from '$lib/stores/appSettings';
	import { formatHex, oklch } from 'culori';

	export let graphData: GraphData;

	let container: HTMLDivElement;
	let cy: cytoscape.Core;
	let previousLayoutName: string;

	const getResolvedColor = (className: string): string => {
		const el = document.createElement('div');
		el.className = `${className} fixed -top-[9999px] w-0 h-0`;
		document.body.appendChild(el);

		const color = getComputedStyle(el).backgroundColor;

		document.body.removeChild(el);
		return formatHex(oklch(color));
	};

	const getLayoutOptions = (settings: typeof $appSettings) => {
		const baseOptions = {
			name: settings.layoutName,
			animate: true,
			animationDuration: 500,
			animationEasing: 'ease-in-out'
		};

		switch (settings.layoutName) {
			case 'cose':
				return {
					...baseOptions,
					animate: 'end'
				};
			case 'circle':
			case 'grid':
				return {
					...baseOptions,
					spacingFactor: 1 // Adjust the factor as needed
				};
			case 'breadthfirst':
				return {
					...baseOptions,
					spacingFactor: 1 // Adjust the factor as needed
				};
			case 'concentric':
				return {
					...baseOptions,
					minNodeSpacing: 1 // Adjust the factor as needed
				};
			case 'random':
				return {
					...baseOptions
				};
			default:
				return baseOptions;
		}
	};

	function applyCytoscapeStyle(settings: typeof $appSettings) {
		if (!cy) return;

		// Resolve colors dynamically based on the current DaisyUI theme
		const accentColor = getResolvedColor('bg-accent');
		const neutralColor = getResolvedColor('bg-neutral');
		const neutralContentColor = getResolvedColor('bg-neutral-content');
		const baseContentColor = getResolvedColor('bg-base-content');
		const base300Color = getResolvedColor('bg-base-300');

		cy.style()
			.selector('node')
			.style({
				label: 'data(label)',
				'background-color': baseContentColor, // node colour
				color: base300Color,
				'text-background-color': baseContentColor,
				'text-background-shape': 'roundrectangle',
				'text-valign': 'center',
				'text-halign': 'center',
				'font-size': settings.nodeFontSize,
				opacity: settings.nodeOpacity,
				'border-width': settings.nodeBorderWidth,
				'text-wrap': settings.wrapText ? 'wrap' : 'none',
				'text-max-width': settings.wrapText ? settings.nodeTextMaxWidth : 1,
				'text-background-opacity': 1,
				'text-background-padding': settings.nodeTextBackgroundPadding
			})
			.selector('edge')
			.style({
				label: 'data(label)',
				'curve-style': settings.curveStyle,
				'target-arrow-shape': 'triangle',
				'line-color': neutralColor,
				'target-arrow-color': neutralColor,
				color: neutralContentColor, // line colour
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
			layout: getLayoutOptions($appSettings),
			wheelSensitivity: 2
		});

		// Subscribe to appSettings store and apply styles on change
		appSettings.subscribe(async (settings) => {
			await tick(); // Ensure DOM is updated with new theme colors

			// Re-run layout only if layoutName has changed
			if (settings.layoutName !== previousLayoutName) {
				cy.layout(getLayoutOptions(settings)).run();
				previousLayoutName = settings.layoutName;
			}

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
