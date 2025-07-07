<script lang="ts">
	import { getContext } from 'svelte';
	import type { Writable } from 'svelte/store';

	interface TabsContext {
		group: string;
		selectedTab: Writable<string>;
	}

	const { selectedTab } = getContext<TabsContext>('tabs');

	export let value: string;
</script>

{#if $selectedTab === value}
	<div class="tab-content">
		<slot />
	</div>
{/if}
