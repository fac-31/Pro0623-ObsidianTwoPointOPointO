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
			{#each daisyUiThemes as theme (theme)}
				<option value={theme}>{theme}</option>
			{/each}
		</select>
	</div>

	<div class="form-control mb-4">
		<label for="layout-select" class="label">Graph Layout</label>
		<select id="layout-select" class="select select-bordered" bind:value={$appSettings.layoutName}>
			<option value="breadthfirst">breadthfirst</option>
			<option value="circle">circle</option>
			<option value="concentric">concentric</option>
			<option value="cose">cose</option>
			<option value="grid">grid</option>
			<option value="random">random</option>
		</select>
	</div>

	<h3 class="text-md font-bold mb-2">Cytoscape Styles</h3>
	<div class="grid grid-cols-2 gap-4">
		<div class="form-control">
			<label for="nodeFontSize" class="label">Node Font Size</label>
			<input
				id="nodeFontSize"
				type="range"
				min="1"
				max="20"
				class="range range-primary"
				bind:value={$appSettings.nodeFontSize}
			/>
		</div>
		<div class="form-control">
			<label for="wrapText" class="label">Wrap Node Text</label>
			<input
				id="wrapText"
				type="checkbox"
				class="toggle toggle-primary"
				bind:checked={$appSettings.wrapText}
			/>
		</div>

		<div class="form-control">
			<label for="edgeFontSize" class="label">Edge Font Size</label>
			<input
				id="edgeFontSize"
				type="range"
				min="1"
				max="20"
				class="range range-primary"
				bind:value={$appSettings.edgeFontSize}
			/>
		</div>

		<div class="form-control">
			<label for="edgeWidth" class="label">Edge Width</label>
			<input
				id="edgeWidth"
				type="range"
				min="1"
				max="10"
				class="range range-primary"
				bind:value={$appSettings.edgeWidth}
			/>
		</div>

		<div class="form-control">
			<label for="nodeTextBackgroundPadding" class="label">Node Text Bg Padding</label>
			<input
				id="nodeTextBackgroundPadding"
				type="range"
				min="0"
				max="10"
				class="range range-primary"
				bind:value={$appSettings.nodeTextBackgroundPadding}
			/>
		</div>
	</div>

	<div class="form-control mb-4">
		<label for="curveStyle-select" class="label">Curve Style</label>
		<select
			id="curveStyle-select"
			class="select select-bordered"
			bind:value={$appSettings.curveStyle}
		>
			<option value="bezier">bezier</option>
			<option value="haystack">haystack</option>
			<option value="segments">segments</option>
			<option value="straight">straight</option>
			<option value="taxi">taxi</option>
			<option value="unbundled-bezier">unbundled-bezier</option>
			<option value="round-segments">round-segments</option>
			<option value="round-taxi">round-taxi</option>
		</select>
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
