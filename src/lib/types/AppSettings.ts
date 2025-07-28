export type LayoutName = 'cose' | 'circle' | 'grid' | 'breadthfirst' | 'concentric' | 'random';

export interface LayoutOptions {
	spacingFactor: number;
	animate?: string;
}

export interface AppSettings {
	currentTheme: string;
	wrapText: boolean;
	curveStyle: string;
	layoutName: LayoutName;
	layout: Record<LayoutName, LayoutOptions>;

	nodeFontSize: number;
	edgeWidth: number;
	nodeBorderWidth: number;
	edgeFontSize: number;
	nodeTextMaxWidth: number;
	edgeTextMaxWidth: number;
	nodeTextBackgroundPadding: string;
	nodeOpacity: number;
	edgeOpacity: number;
	selectedNodeBorderWidth: number;
	selectedNodeFontSize: number;
	selectedEdgeWidth: number;
}
