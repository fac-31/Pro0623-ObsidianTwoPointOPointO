<script lang="ts">
	import { infoPanelStore } from '$lib/stores/infoPanelStore';
	import { page } from '$app/stores';
	import { tabsStore } from '$lib/stores/tabs';

	export let ariaLabel: string = 'Floating action dropdown';
	export let position: string = 'fixed bottom-6 right-6';
	export let onDisplayText: () => void = () => {};
	export const onCreateNew: () => void = () => {};

	function createNew() {
		infoPanelStore.showForm();
	}

	const buildWorldAPI = async () => {
		const worldId = $page.params.id;
		console.log('Building world with ID (API):', worldId);
		try {
			const response = await fetch(`/api/build`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ world_id: worldId })
			});
			if (!response.ok) {
				throw new Error('Failed to build world');
			}
			const result = await response.json();
			console.log('World built successfully:', result);
		} catch (error) {
			console.error('Error building world:', error);
		}
	};

	function openSettings() {
		tabsStore.addTab({ data: { id: '1', name: 'Settings', type: 'settings' } });
	}
	function openCreateWorld() {
		tabsStore.addTab({ data: { id: '2', name: 'Create World', type: 'create-world' } });
	}
</script>

<div class={`dropdown dropdown-top dropdown-center ${position}`}>
	<button
		aria-label={ariaLabel}
		class="btn m-1 text-2xl bg-secondary text-primary-content rounded-full shadow-lg hover:bg-primary-focus focus:outline-none focus:ring-4 focus:ring-primary/50"
	>
		+
	</button>

	<ul class="dropdown-content menu bg-base-100 rounded-box z-10 w-52 p-2 shadow-sm">
		<li>
			<button type="button" on:click={onDisplayText}>Display Text</button>
		</li>
		<li>
			<button type="button" on:click={createNew}>Create New</button>
		</li>
		<li>
			<a href="#" on:click|preventDefault={buildWorldAPI}>Build</a>
		</li>
		<li>
			<button type="button" on:click={openSettings}>Settings</button>
		</li>
		<li>
			<button type="button" on:click={openCreateWorld}>Create World</button>
		</li>
	</ul>
</div>
