export type GraphNode = {
	data: {
		id: string;
		name: string;
		type: string;
		[key: string]: string; // e.g., title, name, etc.
	};
};

export type GraphEdge = {
	data: {
		id: string;
		source: string;
		target: string;
		label: string;
		[key: string]: string;
	};
};

export type WorldInfo = {
	label: string;
	[key: string]: string;
};

export type GraphData = {
	nodes: GraphNode[];
	edges: GraphEdge[];
	relTypes: string[];
	worldInfo?: WorldInfo;
};
