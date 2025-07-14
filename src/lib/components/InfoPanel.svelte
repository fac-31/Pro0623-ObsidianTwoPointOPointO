<script lang="ts">
	import Tabs from './Tabs.svelte';

	export let tabs: { id: number; label: string }[] = [];
	export let activeTabId: number;
	export let setActiveTab: (id: number) => void;
	export let onSave: () => void = () => {
		console.log('Save triggered');
	};
	export let onDelete: () => void = () => {
		console.log('Delete triggered');
	};

	$: useDropdown = tabs.length > 10;

	function handleSelect(event: Event) {
		const selectedId = (event.target as HTMLSelectElement).value;
		setActiveTab(Number(selectedId));
	}
</script>

<div class="rounded-xl bg-base-300 text-base p-4 h-full w-full flex flex-col gap-4">
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
	<div class="flex-1 rounded-xl overflow-hidden bg-base-100">
		{#each tabs as tab (tab.id)}
			{#if tab.id === activeTabId}
				<p>Content for {tab.label}</p>
			{/if}
		{/each}
	</div>
	<div class="flex justify-end gap-2 mt-4">
		<button class="btn btn-secondary" on:click={onDelete}>Delete</button>
		<button class="btn btn-primary" on:click={onSave}>Save</button>
	</div>
</div>
