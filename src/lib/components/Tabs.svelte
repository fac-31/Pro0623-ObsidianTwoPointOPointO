<script lang="ts">
	import { afterUpdate } from 'svelte';

	export let tabs: { id: string; label: string }[] = [];
	export let activeTabId: string | null;
	export let setActiveTab: (id: string) => void;
	export let closeTab: (id: string) => void;

	let tabElements: (HTMLButtonElement | null)[] = [];

	afterUpdate(() => {
		if (activeTabId) {
			const activeIndex = tabs.findIndex((tab) => tab.id === activeTabId);
			if (activeIndex !== -1 && tabElements[activeIndex]) {
				tabElements[activeIndex]?.focus();
			}
		}
	});

	function handleKeyDown(event: KeyboardEvent, index: number) {
		let newIndex: number;
		if (event.key === 'ArrowRight') {
			newIndex = (index + 1) % tabs.length;
			setActiveTab(tabs[newIndex].id);
		} else if (event.key === 'ArrowLeft') {
			newIndex = (index - 1 + tabs.length) % tabs.length;
			setActiveTab(tabs[newIndex].id);
		}
	}
</script>

<div role="tablist" aria-label="Available views" class="tabs tabs-lift">
	{#each tabs as tab, index (tab.id)}
		<div class="relative flex items-center">
			<button
				bind:this={tabElements[index]}
				role="tab"
				class="tab pr-6 {tab.id === activeTabId ? 'tab-active' : ''}"
				on:click={() => setActiveTab(tab.id)}
				on:keydown={(e) => handleKeyDown(e, index)}
				id={`tab-${tab.id}`}
				aria-selected={tab.id === activeTabId}
				tabindex={tab.id === activeTabId ? 0 : -1}
				aria-controls={`tabpanel-${tab.id}`}
			>
				{tab.label}
			</button>
			<button
				type="button"
				class="absolute right-1 text-sm w-4 h-4 flex items-center justify-center hover:text-red-700"
				on:click|stopPropagation={() => closeTab(tab.id)}
				aria-label={`Close ${tab.label} tab`}
			>
				×
			</button>
		</div>
	{/each}
</div>

