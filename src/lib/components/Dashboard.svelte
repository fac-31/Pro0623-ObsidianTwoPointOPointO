<script lang="ts">
	import type { GraphData } from '$lib/types/graph';
	import WorldView from './WorldView.svelte';
	import QueryPanel from './QueryPanel.svelte';
	import InfoPanel from './InfoPanel.svelte';
	import { PaneGroup, Pane, PaneResizer } from 'paneforge';
	import { readable } from 'svelte/store';
	import FloatingButton from './FloatingButton.svelte';

	export let graphData: GraphData;

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
	<Pane defaultSize={80}>
		<WorldView {graphData} showGraph={!showTextView} />
	</Pane>
	<PaneResizer class={`cursor-grab ${$isSmallScreen ? 'h-2 w-full' : 'w-2 h-full'}`} />
	<Pane defaultSize={30}>
		<PaneGroup
			direction={$isSmallScreen ? 'horizontal' : 'vertical'}
			class="h-full"
			data-testid="query-panel"
		>
			<Pane defaultSize={30}>
				<QueryPanel />
			</Pane>
			<PaneResizer
				class={`cursor-grab ${$isSmallScreen ? 'w-2 h-full' : 'h-2 w-full'}`}
				data-testid="info-panel"
			/>
			<Pane defaultSize={70}>
				<InfoPanel {tabs} {activeTabId} {setActiveTab} />
			</Pane>
		</PaneGroup>
	</Pane>
</PaneGroup>

<FloatingButton
	onCreateNew={addTab}
	onDisplayText={toggleTextView}
	position="fixed bottom-6 right-6"
/>
