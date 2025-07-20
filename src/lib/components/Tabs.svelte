<script lang="ts">
	import { infoPanelStore, type Tab } from '$lib/stores/infoPanelStore';

	export let tabs: Tab[] = [];
	export let activeTabId: string | null;
	export let setActiveTab: (id: string) => void;
</script>

<div role="tablist" class="tabs tabs-lifted">
	{#each tabs as tab (tab.id)}
		<div role="tab" class="tab-container relative {tab.id === activeTabId ? 'tab-active' : ''}">
			<button
				class="tab pr-8 {tab.id === activeTabId ? 'tab-active' : ''}"
				on:click={() => setActiveTab(tab.id)}
			>
				{tab.label}
			</button>
			<button
				class="absolute top-1/2 right-1 transform -translate-y-1/2 btn btn-xs btn-ghost"
				on:click|stopPropagation={() => infoPanelStore.closeTab(tab.id)}
				aria-label="Close tab {tab.label}"
			>
				&times;
			</button>
		</div>
	{/each}
</div>

<style>
	.tab-container {
		display: inline-flex;
		align-items: center;
	}
	.tab-active {
		--tab-bg: oklch(var(--b1));
		--tab-border-color: oklch(var(--b1));
	}
</style>
