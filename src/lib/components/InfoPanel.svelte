<script lang="ts">
	import Tabs from './Tabs.svelte';
	import { selectedNode } from '$lib/stores/selectedNode';

	export let tabs: { id: number; label: string }[] = [];
	export let activeTabId: number;
	export let setActiveTab: (id: number) => void;
	export let showTabs: boolean = true; // Add this prop
	export let onSave: () => void = () => {
		console.log('Save triggered');
	};
	export let onDelete: () => void = () => {
		console.log('Delete triggered');
	};
	export let isSmallScreen: boolean; // New prop

	$: useDropdown = tabs.length > 10;

	function handleSelect(event: Event) {
		const selectedId = (event.target as HTMLSelectElement).value;
		setActiveTab(Number(selectedId));
	}
</script>

<div
	class="rounded-xl border-3 border-bg-base-300 text-base p-4 h-full w-full flex flex-col gap-4 p-5 min-w-[300px]"
>
	{#if showTabs}
		{#if useDropdown}
			<div class="flex items-center gap-2">
				<span class="font-bold">Tab:</span>
				<select class="select select-bordered w-full max-w-xs" on:change={handleSelect}>
					{#each tabs as tab (tab.id)}
						<option value={tab.id} selected={tab.id === activeTabId}>{tab.label}</option>
					{/each}
				</select>
			</div>
		{:else}
			<Tabs {tabs} {activeTabId} {setActiveTab} />
		{/if}
	{/if}

	<div class="flex-1 rounded-xl overflow-hidden p-4 flex gap-4 min-h-0">
		<!-- Left content area -->
		<div class="flex-1 overflow-auto">
			{#if $selectedNode}
				<div>
					<h2 class="text-xl font-semibold mb-2">{$selectedNode.data.label}</h2>
					<p>{$selectedNode.data.content}</p>
				</div>
			{:else}
				<p class="text-gray-400 italic">No node selected.</p>
			{/if}
		</div>

		<!-- Right button column -->
		<!-- Right button column -->
		<!-- <div class={`flex justify-end gap-2 ${isSmallScreen ? 'flex-row flex-wrap' : 'flex-col'}`}>
			<button class="btn btn-s btn-secondary" on:click={onDelete}>Delete</button>
			<button class="btn btn-s btn-primary" on:click={onSave}>Save</button>
		</div> -->
	</div>
</div>
