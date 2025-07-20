<script lang="ts">
	export let ariaLabel: string = 'Floating action dropdown';
	export let position: string = 'fixed bottom-6 right-6';
	export let onDisplayText: () => void = () => {};
	export let onCreateNew: () => void = () => {};
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
			<button type="button" on:click={onDisplayText}>Display Text</button>
		</li>
		<li>
			<button type="button" on:click={onCreateNew}>Create New</button>
		</li>
		<li>
			<button type="button" on:click={onToggleSettings}>Settings</button>
		</li>
	</ul>
</div>
