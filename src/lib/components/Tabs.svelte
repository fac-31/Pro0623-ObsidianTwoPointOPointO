<script lang="ts">
	export let tabs: { id: string; label: string }[] = [];
	export let activeTabId: string | null;
	export let setActiveTab: (id: string) => void;
	export let closeTab: (id: string) => void;
</script>

<div role="tablist" class="tabs tabs-lift">
	{#each tabs as tab (tab.id)}
		<div class="relative flex items-center">
			<button
				role="tab"
				class="tab pr-6 {tab.id === activeTabId ? 'tab-active' : ''}"
				on:click={() => setActiveTab(tab.id)}
				id={`tab-${tab.id}`}
			>
				{tab.label}
			</button>
			<button
				type="button"
				class="absolute right-1 text-sm w-4 h-4 flex items-center justify-center hover:text-red-700"
				on:click|stopPropagation={() => closeTab(tab.id)}
				aria-label="Close tab"
			>
				×
			</button>
		</div>
	{/each}
</div>
