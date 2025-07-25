import cytoscape from 'cytoscape';
import { formatHex, oklch } from 'culori';
import type { AppSettings } from '$lib/types/AppSettings';
/**
 * Dynamically resolve the computed color from a Tailwind/DaisyUI class.
 * @param className A CSS class name (e.g. 'bg-accent')
 * @returns A hex color string
 */
export function getResolvedColor(className: string): string {
	const el = document.createElement('div');
	el.className = `${className} fixed -top-[9999px] w-0 h-0`;
	document.body.appendChild(el);

	const color = getComputedStyle(el).backgroundColor;
	document.body.removeChild(el);

	return formatHex(oklch(color)) ?? '#000000';
}

/**
 * Return layout options for the current layoutName using base settings.
 * @param settings App-wide settings
 */
export function getLayoutOptions(settings: AppSettings): cytoscape.LayoutOptions {
	const baseOptions = {
		name: settings.layoutName,
		animate: true,
		animationDuration: 500,
		animationEasing: 'ease-in-out'
	};

	const layoutOptions = settings.layout[settings.layoutName];

	return {
		...baseOptions,
		...layoutOptions
	};
}

/**
 * Apply Cytoscape styles dynamically based on current settings and theme.
 * @param cy Cytoscape instance
 * @param settings App-wide settings
 */
export function applyCytoscapeStyle(cy: cytoscape.Core, settings: AppSettings) {
	if (!cy) return;

	const accentColor = getResolvedColor('bg-accent');
	const neutralColor = getResolvedColor('bg-neutral');
	const neutralContentColor = getResolvedColor('bg-neutral-content');
	const baseContentColor = getResolvedColor('bg-base-content');
	const base300Color = getResolvedColor('bg-base-300');

	cy.style()
		.selector('node')
		.style({
			label: 'data(label)',
			'background-color': baseContentColor,
			color: base300Color,
			'text-background-color': baseContentColor,
			'text-background-shape': 'roundrectangle',
			'text-valign': 'center',
			'text-halign': 'center',
			'font-size': settings.nodeFontSize,
			opacity: settings.nodeOpacity,
			'border-width': settings.nodeBorderWidth,
			'text-wrap': settings.wrapText ? 'wrap' : 'none',
			'text-max-width': settings.wrapText ? `${settings.nodeTextMaxWidth}px` : '0px',
			'text-background-opacity': 1,
			'text-background-padding': settings.nodeTextBackgroundPadding
		})
		.selector('edge')
		.style({
			label: 'data(label)',
			'curve-style': settings.curveStyle as cytoscape.Css.Edge['curve-style'],
			'target-arrow-shape': 'triangle',
			'line-color': neutralColor,
			'target-arrow-color': neutralColor,
			color: neutralContentColor,
			'text-rotation': 'autorotate',
			'font-size': settings.edgeFontSize,
			width: settings.edgeWidth,
			'text-wrap': 'wrap',
			'text-max-width': `${settings.edgeTextMaxWidth}px`
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
            'font-size': settings.edgeFontSize + 3,
			width: settings.selectedEdgeWidth
		})
		.update();
}
