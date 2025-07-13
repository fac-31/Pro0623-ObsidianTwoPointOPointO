<script lang="ts">
	import Tabs from './Tabs.svelte';

	export let tabs: { id: number; label: string }[] = [];
	export let activeTabId: number;
	export let setActiveTab: (id: number) => void;
</script>

<div class="rounded-xl bg-base-300 text-base p-4 h-full w-full flex flex-col gap-4">
	<Tabs {tabs} {activeTabId} {setActiveTab} />
	<div class="flex-1 overflow-hidden">
		{#each tabs as tab}
			{#if tab.id === activeTabId}
				<p>Content for {tab.label}</p>
			{/if}
		{/each}
	</div>
</div>
