<script lang="ts">
	import { appSettings } from '../stores/appSettings';
	import { onMount } from 'svelte';

	const daisyUiThemes = [
		'light',
		'dark',
		'cupcake',
		'bumblebee',
		'emerald',
		'corporate',
		'synthwave',
		'retro',
		'cyberpunk',
		'valentine',
		'halloween',
		'garden',
		'forest',
		'aqua',
		'lofi',
		'pastel',
		'fantasy',
		'wireframe',
		'black',
		'luxury',
		'dracula',
		'cmyk',
		'autumn',
		'business',
		'acid',
		'lemonade',
		'night',
		'coffee',
		'winter',
		'dim',
		'nord',
		'sunset'
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
			on:change={(e) => document.documentElement.setAttribute('data-theme', (e.target as HTMLSelectElement).value)}
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
			<input id="nodeFontSize" type="number" class="input input-bordered" bind:value={$appSettings.nodeFontSize} />
		</div>
		<div class="form-control">
			<label for="edgeWidth" class="label">Edge Width</label>
			<input id="edgeWidth" type="number" class="input input-bordered" bind:value={$appSettings.edgeWidth} />
		</div>
		<div class="form-control">
			<label for="nodeBorderWidth" class="label">Node Border Width</label>
			<input id="nodeBorderWidth" type="number" class="input input-bordered" bind:value={$appSettings.nodeBorderWidth} />
		</div>
		<div class="form-control">
			<label for="edgeFontSize" class="label">Edge Font Size</label>
			<input id="edgeFontSize" type="number" class="input input-bordered" bind:value={$appSettings.edgeFontSize} />
		</div>
		<div class="form-control">
			<label for="nodeTextMaxWidth" class="label">Node Text Max Width</label>
			<input id="nodeTextMaxWidth" type="number" class="input input-bordered" bind:value={$appSettings.nodeTextMaxWidth} />
		</div>
		<div class="form-control">
			<label for="edgeTextMaxWidth" class="label">Edge Text Max Width</label>
			<input id="edgeTextMaxWidth" type="number" class="input input-bordered" bind:value={$appSettings.edgeTextMaxWidth} />
		</div>
		<div class="form-control">
			<label for="nodeTextBackgroundPadding" class="label">Node Text Bg Padding</label>
			<input id="nodeTextBackgroundPadding" type="text" class="input input-bordered" bind:value={$appSettings.nodeTextBackgroundPadding} />
		</div>
		<div class="form-control">
			<label for="nodeOpacity" class="label">Node Opacity</label>
			<input id="nodeOpacity" type="number" step="0.1" min="0" max="1" class="input input-bordered" bind:value={$appSettings.nodeOpacity} />
		</div>
		<div class="form-control">
			<label for="edgeOpacity" class="label">Edge Opacity</label>
			<input id="edgeOpacity" type="number" step="0.1" min="0" max="1" class="input input-bordered" bind:value={$appSettings.edgeOpacity} />
		</div>
		<div class="form-control">
			<label for="selectedNodeBorderWidth" class="label">Selected Node Border Width</label>
			<input id="selectedNodeBorderWidth" type="number" class="input input-bordered" bind:value={$appSettings.selectedNodeBorderWidth} />
		</div>
		<div class="form-control">
			<label for="selectedNodeFontSize" class="label">Selected Node Font Size</label>
			<input id="selectedNodeFontSize" type="number" class="input input-bordered" bind:value={$appSettings.selectedNodeFontSize} />
		</div>
		<div class="form-control">
			<label for="selectedEdgeWidth" class="label">Selected Edge Width</label>
			<input id="selectedEdgeWidth" type="number" class="input input-bordered" bind:value={$appSettings.selectedEdgeWidth} />
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