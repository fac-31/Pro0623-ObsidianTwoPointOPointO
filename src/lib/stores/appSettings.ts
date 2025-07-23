import { writable } from 'svelte/store';

export const appSettings = writable({
	currentTheme: 'wireframe',
	wrapText: true,
	curveStyle: 'bezier',
	layoutName: 'cose',
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
