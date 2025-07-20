import type cytoscape from 'cytoscape';
import { infoPanelStore } from '$lib/stores/infoPanelStore';

export function registerNodeClickEvents(cy: cytoscape.Core) {
	cy.on('tap', 'node', (event) => {
		cy.nodes().removeClass('selected');
		const node = event.target;
		node.addClass('selected');
		infoPanelStore.openTab(node.data());
	});

	cy.on('tap', (event) => {
		if (event.target === cy) {
			cy.nodes().removeClass('selected');
			infoPanelStore.clearSelection();
		}
	});
}
