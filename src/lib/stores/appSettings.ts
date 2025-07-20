import { writable } from 'svelte/store';

export const appSettings = writable({
	currentTheme: 'light',
	nodeFontSize: 7,
	edgeWidth: 4,
	nodeBorderWidth: 0,
	edgeFontSize: 3,
	nodeTextMaxWidth: 80,
	edgeTextMaxWidth: 80,
	nodeTextBackgroundPadding: '2px',
	nodeOpacity: 1,
	edgeOpacity: 1,
	selectedNodeBorderWidth: 1,
	selectedNodeFontSize: 9,
	selectedEdgeWidth: 6
});