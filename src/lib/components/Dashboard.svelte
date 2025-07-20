<script lang="ts">
	import type { GraphData } from '$lib/types/graph';
	import WorldView from './WorldView.svelte';
	import QueryPanel from './QueryPanel.svelte';
	import InfoPanel from './InfoPanel.svelte';
	import { PaneGroup, Pane, PaneResizer } from 'paneforge';
	import { readable } from 'svelte/store';

	export let graphData: GraphData;

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
	class="h-full p-4"
	data-testid="dashboard"
>
	<Pane defaultSize={80}>
		<WorldView
			{graphData}
			showGraph={!showTextView}
			on:createNew={() => {
				/* Placeholder for future implementation */
			}}
			on:displayText={toggleTextView}
		/>
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
				<InfoPanel />
			</Pane>
		</PaneGroup>
	</Pane>
</PaneGroup>
