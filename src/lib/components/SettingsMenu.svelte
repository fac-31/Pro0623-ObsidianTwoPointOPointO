<script lang="ts">
	import { appSettings } from '../stores/appSettings';
	import { onMount } from 'svelte';

	const daisyUiThemes = [
		'wireframe',
		'cupcake',
		'emerald',
		'garden',
		'lofi',
		'pastel',
		'fantasy',
		'cmyk',
		'autumn',
		'acid',
		'winter',
		'nord',
		'retro',
		'lemonade',
		'cyberpunk',
		'coffee',
		'dim',
		'sunset',
		'night',
		'luxury',
		'dracula',
		'aqua',
		'forest',
		'dark',
		'synthwave',
		'black'
	];

	onMount(() => {
		// Set initial theme on mount
		document.documentElement.setAttribute('data-theme', $appSettings.currentTheme);

		// Subscribe to theme changes
		appSettings.subscribe((settings) => {
			document.documentElement.setAttribute('data-theme', settings.currentTheme);
		});
	});
</script>

<div class="settings-menu p-4 bg-base-200 rounded-box shadow-lg overflow-y-auto">
	<h2 class="text-lg font-bold mb-4">App Settings</h2>

	<div class="form-control mb-4">
		<label for="theme-select" class="label">DaisyUI Theme</label>
		<select
			id="theme-select"
			class="select select-bordered"
			bind:value={$appSettings.currentTheme}
			on:change={(e) =>
				document.documentElement.setAttribute('data-theme', (e.target as HTMLSelectElement).value)}
		>
			{#each daisyUiThemes as theme}
				<option value={theme}>{theme}</option>
			{/each}
		</select>
	</div>

	<h3 class="text-md font-bold mb-2">Cytoscape Styles</h3>
	<div class="grid grid-cols-2 gap-4">
		<div class="form-control">
			<label for="nodeFontSize" class="label">Node Font Size</label>
			<input
				id="nodeFontSize"
				type="number"
				class="input input-bordered"
				bind:value={$appSettings.nodeFontSize}
			/>
		</div>
		<label>
			<input
				id="wrapNodeText"
				type="checkbox"
				class="checkbox"
				checked={true}
				on:change={(e) => {
					const checked = (e.target as HTMLInputElement).checked;
					appSettings.update((s) => ({
						...s,
						wrapNodeText: !checked,
						nodeTextMaxWidth: checked ? 80 : 1
					}));
				}}
			/>
			Wrap Text
		</label>

		<div class="form-control">
			<label for="edgeFontSize" class="label">Edge Font Size</label>
			<input
				id="edgeFontSize"
				type="number"
				class="input input-bordered"
				bind:value={$appSettings.edgeFontSize}
			/>
		</div>

		<div class="form-control">
			<label for="nodeTextBackgroundPadding" class="label">Node Text Bg Padding</label>
			<input
				id="nodeTextBackgroundPadding"
				type="text"
				class="input input-bordered"
				bind:value={$appSettings.nodeTextBackgroundPadding}
			/>
		</div>
	</div>
</div>

<style>
	.settings-menu {
		position: absolute;
		top: 1rem;
		right: 1rem;
		width: 300px;
		height: 90%;
		z-index: 1000;
	}
</style>
