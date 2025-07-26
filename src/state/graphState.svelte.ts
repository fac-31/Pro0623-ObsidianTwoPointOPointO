import type cytoscape from 'cytoscape';
import type { GraphData, Node } from '$lib/types/graph';

/**
 * Reactive state for managing a graph view, including:
 * - Current context (the world node you are within)
 * - Graph data (nodes, edges, world metadata)
 * - Selected node (used for UI highlighting and detail display)
 * - Selection/highlighting logic
 */

export const graphState = $state({
	/**
	 * The currently selected node (for UI display, info panel, etc).
	 */
	selectedNode: null as Node | null,

	/**
	 * The full graph data for the current context.
	 * Includes nodes, edges, and contextNode.
	 */
	graphData: null as GraphData | null,

	/**
	 * Select a node by ID, updating selectedNode and highlighting it in Cytoscape.
	 */
	selectNodeById(cy: cytoscape.Core, id: string) {
		const node = cy.getElementById(id);
		if (!node || !node.isNode()) return;

		this.selectedNode = node.data();

		// Reset visual styles
		cy.nodes().removeClass('selected');
		cy.elements().removeClass('faded');

		// Highlight selected node and neighborhood
		node.addClass('selected');
		const connected = node.closedNeighborhood();
		cy.elements().difference(connected).addClass('faded');
	},

	/**
	 * Clear selection and reset Cytoscape element styles.
	 */
	clearSelection(cy: cytoscape.Core) {
		this.selectedNode = null;
		cy.nodes().removeClass('selected');
		cy.elements().removeClass('faded');
	},

	/**
	 * Load new graph data (usually via fetch) into state.
	 */
	setGraphData(data: GraphData) {
		this.graphData = data;
	}
});
