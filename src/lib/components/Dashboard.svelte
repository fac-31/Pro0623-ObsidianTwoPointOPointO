<script lang="ts">
	import type { GraphData } from '$lib/types/graph';
	import WorldView from './WorldView.svelte';
	import QueryPanel from './QueryPanel.svelte';
	import InfoPanel from './InfoPanel.svelte';
	import SearchBar from './SearchBar.svelte';
	import { PaneGroup, Pane, PaneResizer } from 'paneforge';
	import { readable } from 'svelte/store';

	export let graphData: GraphData;

	// Dashboard Options
	export let showQueryPanel: boolean = true;
	export let showInfoPanel: boolean = true;
	export let showInfoPanelTabs: boolean = false;
	export let showSearchBar: boolean = false;

	let tabs = [{ id: 1, label: 'Tab 1' }];
	let activeTabId = 1;
	let showTextView = false;

	function addTab() {
		const newId = tabs.length > 0 ? Math.max(...tabs.map((t) => t.id)) + 1 : 1;
		tabs = [...tabs, { id: newId, label: `Tab ${newId}` }];
		activeTabId = newId;
	}

	function setActiveTab(id: number) {
		activeTabId = id;
	}

	function toggleTextView() {
		showTextView = !showTextView;
	}

	const isSmallScreen = readable(false, (set) => {
		if (typeof window === 'undefined') return;
		const mediaQuery = window.matchMedia('(max-width: 1023px)');
		const onChange = () => set(mediaQuery.matches);
		mediaQuery.addEventListener('change', onChange);
		onChange(); // Set initial value
		return () => mediaQuery.removeEventListener('change', onChange);
	});
</script>

<PaneGroup
	direction={$isSmallScreen ? 'vertical' : 'horizontal'}
	class="h-full p-4"
	data-testid="dashboard"
>
	<Pane defaultSize={76} maxSize={75} class="relative">
		{#if showSearchBar}
			<div class="absolute top-4 left-4 z-10"><SearchBar /></div>
		{/if}
		<WorldView
			{graphData}
			showGraph={!showTextView}
			on:createNew={addTab}
			on:displayText={toggleTextView}
		/>
	</Pane>
	<PaneResizer
		class={`cursor-grab flex items-center justify-center ${
			$isSmallScreen ? 'h-6 w-full' : 'w-6 h-full'
		}`}
	>
		<div class={`bg-neutral-content rounded-full ${$isSmallScreen ? 'h-4 w-8' : 'w-1 h-8 p-1'}`}></div>
	</PaneResizer>

	<Pane>
		{#if showQueryPanel || showInfoPanel}
			<PaneGroup direction="vertical" class="h-full gap-9" data-testid="query-info-panel-group">
				{#if showQueryPanel}
					<Pane defaultSize={25} minSize={15}>
						<QueryPanel isSmallScreen={$isSmallScreen} />
					</Pane>
				{/if}
				{#if showInfoPanel}
					<Pane>
						<InfoPanel
							showTabs={showInfoPanelTabs}
							{tabs}
							{activeTabId}
							{setActiveTab}
							isSmallScreen={$isSmallScreen}
						/>
					</Pane>
				{/if}
			</PaneGroup>
		{/if}
	</Pane>
</PaneGroup>
