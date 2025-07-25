import { writable } from 'svelte/store';
import type { AppSettings } from '../types/AppSettings';

export const appSettings = writable<AppSettings>({
	currentTheme: 'wireframe',
	wrapText: true,
	curveStyle: 'bezier',
	layoutName: 'cose',

	// SpacingFactor values make it so changing the layout keeps spacing similar.
	layout: {
		cose: {
			spacingFactor: 1.3,
			animate: 'end'
		},
		circle: {
			spacingFactor: 0.3
		},
		grid: {
			spacingFactor: 0.3
		},
		breadthfirst: {
			spacingFactor: 1
		},
		concentric: {
			spacingFactor: 2
		},
		random: {
			spacingFactor: 0.3
		}
	},

	nodeFontSize: 7,
	edgeWidth: 4,
	nodeBorderWidth: 0,
	edgeFontSize: 3,
	nodeTextMaxWidth: 80,
	edgeTextMaxWidth: 80,
	nodeTextBackgroundPadding: '3px',
	nodeOpacity: 1,
	edgeOpacity: 1,
	selectedNodeBorderWidth: 1,
	selectedNodeFontSize: 9,
	selectedEdgeWidth: 6
});
