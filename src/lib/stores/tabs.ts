import type { GraphNode } from '$lib/types/graph';
import { writable, derived } from 'svelte/store';

export type Tab = GraphNode | { data: { id: string; name: string; type: 'settings' } };

interface TabsStore {
	tabs: Tab[];
	activeTabId: string | null;
}

const createTabsStore = () => {
	const { subscribe, update } = writable<TabsStore>({
		tabs: [],
		activeTabId: null
	});

	const addTab = (tab: Tab) => {
		update((store) => {
			if (!store.tabs.find((t) => t.data.id === tab.data.id)) {
				return {
					tabs: [...store.tabs, tab],
					activeTabId: tab.data.id
				};
			}
			// If tab is already in the list, just make it active
			return {
				...store,
				activeTabId: tab.data.id
			};
		});
	};

	const removeTab = (tabId: string) => {
		update((store) => {
			const newTabs = store.tabs.filter((t) => t.data.id !== tabId);
			let newActiveTabId = store.activeTabId;

			// If the closed tab was the active one, select another tab
			if (store.activeTabId === tabId) {
				if (newTabs.length > 0) {
					const closedIndex = store.tabs.findIndex((t) => t.data.id === tabId);
					const newActiveIndex = Math.max(0, closedIndex - 1);
					newActiveTabId = newTabs[newActiveIndex]?.data.id || null;
				} else {
					newActiveTabId = null;
				}
			}

			return {
				tabs: newTabs,
				activeTabId: newActiveTabId
			};
		});
	};

	const setActiveTab = (tabId: string) => {
		update((store) => ({
			...store,
			activeTabId: tabId
		}));
	};

	return {
		subscribe,
		addTab,
		removeTab,
		setActiveTab
	};
};

export const tabsStore = createTabsStore();

export const activeTab = derived(
	tabsStore,
	($tabsStore) =>
		$tabsStore.tabs.find((t) => t.data.id === $tabsStore.activeTabId) || null
);