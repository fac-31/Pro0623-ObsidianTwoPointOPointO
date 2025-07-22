import type { GraphNode } from '$lib/types/graph';
import { writable, derived } from 'svelte/store';

interface SelectedNodesStore {
	nodes: GraphNode[];
	activeNodeId: string | null;
}

const createSelectedNodesStore = () => {
	const { subscribe, update } = writable<SelectedNodesStore>({
		nodes: [],
		activeNodeId: null
	});

	const addNode = (node: GraphNode) => {
		update((store) => {
			if (!store.nodes.find((n) => n.data.id === node.data.id)) {
				return {
					nodes: [...store.nodes, node],
					activeNodeId: node.data.id
				};
			}
			// If node is already in the list, just make it active
			return {
				...store,
				activeNodeId: node.data.id
			};
		});
	};

	const removeNode = (nodeId: string) => {
		update((store) => {
			const newNodes = store.nodes.filter((n) => n.data.id !== nodeId);
			let newActiveNodeId = store.activeNodeId;

			// If the closed tab was the active one, select another tab
			if (store.activeNodeId === nodeId) {
				if (newNodes.length > 0) {
					const closedIndex = store.nodes.findIndex((n) => n.data.id === nodeId);
					const newActiveIndex = Math.max(0, closedIndex - 1);
					newActiveNodeId = newNodes[newActiveIndex]?.data.id || null;
				} else {
					newActiveNodeId = null;
				}
			}

			return {
				nodes: newNodes,
				activeNodeId: newActiveNodeId
			};
		});
	};

	const setActiveNode = (nodeId: string) => {
		update((store) => ({
			...store,
			activeNodeId: nodeId
		}));
	};

	return {
		subscribe,
		addNode,
		removeNode,
		setActiveNode
	};
};

export const selectedNodesStore = createSelectedNodesStore();

export const activeNode = derived(
	selectedNodesStore,
	($selectedNodesStore) =>
		$selectedNodesStore.nodes.find((n) => n.data.id === $selectedNodesStore.activeNodeId) || null
);
