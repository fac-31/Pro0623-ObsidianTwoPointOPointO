import { writable } from 'svelte/store';

function createInfoPanelStore() {
	const { subscribe, update } = writable({
		showCreateNewForm: false
	});

	return {
		subscribe,
		showForm: () => {
			update((state) => ({ ...state, showCreateNewForm: true }));
		},
		hideForm: () => {
			update((state) => ({ ...state, showCreateNewForm: false }));
		}
	};
}

export const infoPanelStore = createInfoPanelStore();
