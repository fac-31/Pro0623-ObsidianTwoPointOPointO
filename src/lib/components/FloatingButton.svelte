<script lang="ts">
	import { infoPanelStore } from '$lib/stores/infoPanelStore';
	import { page } from '$app/stores';

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
	export let onToggleSettings: () => void = () => {};
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
			<a
				href={'#'}
				role="button"
				on:click={onDisplayText}
				on:keydown={(e) => e.key === 'Enter' && onDisplayText()}
			>
				Display Text
			</a>
		</li>
		<li>
			<a
				href={'#'}
				role="button"
				on:click={createNew}
				on:keydown={(e) => e.key === 'Enter' && createNew()}
			>
				Create New
			</a>
		</li>
		<li>
			<a
				href={'#'}
				role="button"
				on:click={buildWorldAPI}
				on:keydown={(e) => e.key === 'Enter' && buildWorldAPI()}
			>
				Build
			</a>
		</li>
		<li>
			<a
				href={'#'}
				role="button"
				on:click={onToggleSettings}
				on:keydown={(e) => e.key === 'Enter' && onToggleSettings()}
			>
				Settings
			</a>
		</li>
	</ul>
</div>
