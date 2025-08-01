import { writable } from 'svelte/store';
import type { AppSettings } from '../types/AppSettings';

const FONT_SIZE = 9;
const EDGE_FONT_SIZE = 1;
const INCREASE_ON_SELECT = 4;

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
			spacingFactor: 1
		},
		grid: {
			spacingFactor: 1
		},
		breadthfirst: {
			spacingFactor: 1
		},
		concentric: {
			spacingFactor: 1
		},
		random: {
			spacingFactor: 1
		}
	},

	nodeFontSize: FONT_SIZE,
	edgeWidth: 1,
	nodeBorderWidth: 0,
	edgeFontSize: EDGE_FONT_SIZE + INCREASE_ON_SELECT,
	nodeTextMaxWidth: 80,
	edgeTextMaxWidth: 80,
	nodeTextBackgroundPadding: '1px',
	nodeOpacity: 1,
	edgeOpacity: 1,
	selectedNodeBorderWidth: 1,
	selectedNodeFontSize: FONT_SIZE + INCREASE_ON_SELECT,
	selectedEdgeWidth: 6
});
