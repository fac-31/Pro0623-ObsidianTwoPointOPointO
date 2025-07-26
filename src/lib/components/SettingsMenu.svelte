<script lang="ts">
	import { appSettings } from '../stores/appSettings';
	import { onMount } from 'svelte';

	onMount(() => {
		document.documentElement.setAttribute('data-theme', $appSettings.currentTheme);

		appSettings.subscribe((settings) => {
			document.documentElement.setAttribute('data-theme', settings.currentTheme);
		});
	});
</script>

<div class="p-4 overflow-y-auto">
	<div class="grid grid-cols-1 gap-4">
		<div class="form-control">
			<label for="layout-select" class="label">Graph Layout</label>
			<select
				id="layout-select"
				class="select select-bordered"
				bind:value={$appSettings.layoutName}
			>
				<option value="breadthfirst">breadthfirst</option>
				<option value="circle">circle</option>
				<option value="concentric">concentric</option>
				<option value="cose">cose</option>
				<option value="grid">grid</option>
				<option value="random">random</option>
			</select>
		</div>

		<div class="form-control">
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
			<label for="wrapText" class="label">Wrap Node Text</label>
			<input id="wrapText" type="checkbox" class="toggle" bind:checked={$appSettings.wrapText} />
		</div>
	</div>
</div>