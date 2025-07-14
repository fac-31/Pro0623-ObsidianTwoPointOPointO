<script lang="ts">
	export let tabs: { id: number; label: string }[] = [];
	export let activeTabId: number;
	export let setActiveTab: (id: number) => void;
</script>

<div role="tablist" class="tabs tabs-lift">
	{#each tabs as tab (tab.id)}
		<button
			role="tab"
			class="tab {tab.id === activeTabId ? 'tab-active' : ''}"
			on:click={() => setActiveTab(tab.id)}
		>
			{tab.label}
		</button>
	{/each}
</div>
