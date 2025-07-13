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
</script>

<div class="rounded-xl bg-base-300 text-base p-4 h-full w-full flex flex-col gap-4">
	<Tabs {tabs} {activeTabId} {setActiveTab} />
	<div class="flex-1 rounded-xl overflow-hidden bg-base-100">
		{#each tabs as tab}
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
