import { writable } from 'svelte/store';
import type { NodeData } from '$lib/types/graph';

export interface Tab {
	id: string;
	label: string;
	data: NodeData;
	modified: boolean;
}

interface InfoPanelStore {
	tabs: Tab[];
	activeTabId: string | null;
}

function createInfoPanelStore() {
	const { subscribe, update, set } = writable<InfoPanelStore>({
		tabs: [],
		activeTabId: null
	});

	function openTab(nodeData: NodeData) {
		if (!nodeData.id) {
			console.error('Node data is missing an ID');
			return;
		}

		update((state) => {
			const existingTab = state.tabs.find((t) => t.id === nodeData.id);

			if (existingTab) {
				// Tab already exists, just make it active
				return { ...state, activeTabId: existingTab.id };
			}

			// If there's one unmodified tab, replace it. Otherwise, add a new one.
			const newTab: Tab = {
				id: nodeData.id,
				label: nodeData.name || nodeData.id,
				data: nodeData,
				modified: false
			};

			const newTabs = [...state.tabs, newTab];

			return {
				tabs: newTabs,
				activeTabId: newTab.id
			};
		});
	}

	function closeTab(tabId: string) {
		update((state) => {
			const tabIndex = state.tabs.findIndex((t) => t.id === tabId);
			if (tabIndex === -1) return state;

			const newTabs = state.tabs.filter((t) => t.id !== tabId);
			let newActiveTabId = state.activeTabId;

			if (state.activeTabId === tabId) {
				if (newTabs.length > 0) {
					// Set active to the previous tab or the first one
					newActiveTabId = newTabs[Math.max(0, tabIndex - 1)].id;
				} else {
					newActiveTabId = null;
				}
			}

			return {
				tabs: newTabs,
				activeTabId: newActiveTabId
			};
		});
	}

	function setActiveTab(tabId: string) {
		update((state) => ({ ...state, activeTabId: tabId }));
	}

	function setTabModified(tabId: string, modified: boolean) {
		update((state) => {
			const newTabs = state.tabs.map((tab) => {
				if (tab.id === tabId) {
					return { ...tab, modified };
				}
				return tab;
			});
			return { ...state, tabs: newTabs };
		});
	}

	function clearSelection() {
		update((state) => ({ ...state, activeTabId: null }));
	}

	return {
		subscribe,
		openTab,
		closeTab,
		setActiveTab,
		setTabModified,
		clearSelection,
		reset: () => set({ tabs: [], activeTabId: null })
	};
}

export const infoPanelStore = createInfoPanelStore();
