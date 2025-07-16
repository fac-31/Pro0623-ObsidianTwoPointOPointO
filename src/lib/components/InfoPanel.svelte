<script lang="ts">
	import Tabs from './Tabs.svelte';
	import { selectedNode } from '$lib/stores/selectedNode';

	export let tabs: { id: number; label: string }[] = [];
	export let activeTabId: number;
	export let setActiveTab: (id: number) => void;
	export let showTabs: boolean = true;
	export let buttons: { label: string; onClick: () => void; class?: string }[] = [];

	$: useDropdown = tabs.length > 10;

	function handleSelect(event: Event) {
		const selectedId = (event.target as HTMLSelectElement).value;
		setActiveTab(Number(selectedId));
	}
</script>

<div
	class="rounded-4xl border-3 border-bg-base-300 text-base p-4 h-full w-full flex flex-col gap-4 pt-5 min-w-[300px]"
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
				<div class="flex flex-wrap items-center gap-4 mb-2">
					<h2 class="text-xl font-semibold">{$selectedNode.data.label}</h2>
					{#if buttons.length}
						<div class="flex gap-2 flex-wrap">
							{#each buttons as button (button.label)}
								<button
									class={`btn btn-sm ${button.class ?? 'btn-secondary'}`}
									on:click={button.onClick}
								>
									{button.label}
								</button>
							{/each}
						</div>
					{/if}
				</div>
				<p>{$selectedNode.data.content}</p>
			{:else}
				<p class="text-gray-400 italic">No node selected.</p>
			{/if}
		</div>
	</div>
</div>
