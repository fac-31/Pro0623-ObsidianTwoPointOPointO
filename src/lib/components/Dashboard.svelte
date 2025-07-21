<script lang="ts">
	import type { GraphData, WorldInfo } from '$lib/types/graph';
	import WorldView from './WorldView.svelte';
	import QueryPanel from './QueryPanel.svelte';
	import InfoPanel from './InfoPanel.svelte';
	import SearchBar from './SearchBar.svelte';
	import { PaneGroup, Pane, PaneResizer } from 'paneforge';
	import { readable } from 'svelte/store';

	export let graphData: GraphData;
	export let worldName: string;

	let currentGraphData: GraphData = graphData;
	let explanation: string = '';

	function handleResult(event: CustomEvent) {
		console.log('Dashboard: received event.detail:', event.detail);
		const { graphData, explanation: newExplanation } = event.detail;

		currentGraphData = {
			nodes: [...graphData.nodes],
			edges: [...graphData.edges]
		};
		console.log('Dashboard: currentGraphData now:', currentGraphData);

		explanation = newExplanation;
	}

	// Dashboard Options
	export let graphTitle: string;
	export let worldInfo: WorldInfo | undefined = undefined;
	export let showQueryPanel: boolean = true;
	export let showInfoPanel: boolean = true;
	export const showInfoPanelTabs: boolean = false;
	export let showSearchBar: boolean = false;
	export let dashboardButtons: { label: string; onClick: () => void; class?: string }[] = [];

	let showTextView = false;

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
	class="h-full py-4 px-3"
	data-testid="dashboard"
>
	<Pane defaultSize={80} minSize={20} class="relative">
		{#if showSearchBar}
			<div class="absolute top-4 left-4 z-10"><SearchBar /></div>
		{/if}
		<WorldView
			graphData={currentGraphData}
			showGraph={!showTextView}
			on:displayText={toggleTextView}
		/>
	</Pane>
	<PaneResizer
		class={`${
			$isSmallScreen ? 'h-5 w-full p-4' : 'w-5 h-full'
		} flex items-center justify-center bg-base-100 `}
	>
		<div class={`bg-neutral-content/30 ${$isSmallScreen ? 'w-4/5 h-1' : 'h-4/5 w-1'}`}></div>
	</PaneResizer>

	<Pane defaultSize={30} minSize={25}>
		{#if showQueryPanel || showInfoPanel}
			<PaneGroup direction="vertical" class="h-full gap-4" data-testid="query-info-panel-group">
				{#if showInfoPanel}
					<Pane
						class="min-h-20"
						defaultSize={$isSmallScreen ? 50 : 80}
						minSize={$isSmallScreen ? 40 : 20}
					>
						<InfoPanel buttons={dashboardButtons} {graphTitle} worldContent={worldInfo?.content} />
					</Pane>
				{/if}
				{#if showQueryPanel}
					<Pane
						class="min-h-10 max-h-35"
						defaultSize={$isSmallScreen ? 50 : 20}
						minSize={$isSmallScreen ? 50 : 30}
						maxSize={$isSmallScreen ? 50 : 20}
					>
						<QueryPanel {worldName} on:result={handleResult} />
					</Pane>
				{/if}
			</PaneGroup>
		{/if}
	</Pane>
</PaneGroup>
