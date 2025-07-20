<script lang="ts">
	import { infoPanelStore, type Tab } from '$lib/stores/infoPanelStore';
	import Tabs from './Tabs.svelte';

	export let onSave: (tab: Tab) => void = (tab) => {
		console.log('Save triggered for:', tab);
	};
	export let onDelete: (tab: Tab) => void = (tab) => {
		console.log('Delete triggered for:', tab);
	};

	$: useDropdown = $infoPanelStore.tabs.length > 10;
	$: activeTab = $infoPanelStore.tabs.find((t) => t.id === $infoPanelStore.activeTabId);

	function handleSelect(event: Event) {
		const selectedId = (event.target as HTMLSelectElement).value;
		infoPanelStore.setActiveTab(selectedId);
	}

	function handleSave() {
		if (activeTab) {
			onSave(activeTab);
		}
	}

	function handleDelete() {
		if (activeTab) {
			onDelete(activeTab);
		}
	}
</script>

<div class="rounded-xl bg-base-300 text-base p-4 h-full w-full flex flex-col gap-4">
	{#if useDropdown}
		<div class="flex items-center gap-2">
			<span class="font-bold">Tab:</span>
			<select class="select select-bordered w-full max-w-xs" on:change={handleSelect}>
				{#each $infoPanelStore.tabs as tab (tab.id)}
					<option value={tab.id} selected={tab.id === $infoPanelStore.activeTabId}
						>{tab.label}</option
					>
				{/each}
			</select>
		</div>
	{:else}
		<Tabs
			tabs={$infoPanelStore.tabs}
			activeTabId={$infoPanelStore.activeTabId}
			setActiveTab={infoPanelStore.setActiveTab}
		/>
	{/if}

	<div class="flex-1 rounded-xl overflow-auto bg-base-100 p-4">
		{#if activeTab}
			<div class="prose">
				<h2>{activeTab.label}</h2>
				<p><strong>ID:</strong> {activeTab.id}</p>
				<p><strong>Modified:</strong> {activeTab.modified}</p>
				<h3>Data:</h3>
				<ul>
					{#each Object.entries(activeTab.data) as [key, value]}
						<li><strong>{key}:</strong> {JSON.stringify(value)}</li>
					{/each}
				</ul>
			</div>
		{:else}
			<div class="flex items-center justify-center h-full">
				<p></p>
			</div>
		{/if}
	</div>

	<div class="flex justify-end gap-2 mt-4">
		<button class="btn btn-secondary" on:click={handleDelete} disabled={!activeTab}>Delete</button>
		<button class="btn btn-primary" on:click={handleSave} disabled={!activeTab}>Save</button>
	</div>
</div>
