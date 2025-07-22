<script lang="ts">
	export let ariaLabel: string = 'Floating action dropdown';
	export let position: string = 'fixed bottom-6 right-6';
	export let onDisplayText: () => void = () => {};
	export let onCreateNew: () => void = () => {};

	import { page } from '$app/state';

	const buildWorldAPI = async () => {
		console.log('Building world with ID (API):', page.params.id);
		try {
			const response = await fetch(`/api/build`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ worldId: page.params.id })
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
</script>

<div class={`dropdown dropdown-top dropdown-center ${position}`}>
	<div
		tabindex="0"
		role="button"
		class="btn m-1 text-2xl bg-secondary text-primary-content rounded-full shadow-lg hover:bg-primary-focus focus:outline-none focus:ring-4 focus:ring-primary/50"
		aria-label={ariaLabel}
	>
		+
	</div>
	<ul tabindex="0" class="dropdown-content menu bg-base-100 rounded-box z-10 w-52 p-2 shadow-sm">
		<li>
			<a href="#" on:click|preventDefault={onDisplayText}>Display Text</a>
		</li>
		<li>
			<a href="#" on:click|preventDefault={onCreateNew}>Create New</a>
		</li>
		<li>
			<a href="#" on:click|preventDefault={buildWorldAPI}>Build</a>
		</li>
	</ul>
</div>
