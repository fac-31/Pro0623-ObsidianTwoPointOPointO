<script lang="ts">
	import { getContext } from 'svelte';
	import type { Writable } from 'svelte/store';

	interface TabsContext {
		group: string;
		selectedTab: Writable<string>;
	}

	export let label: string;
	export let value: string;
	export let checked: boolean = false;

	const { group, selectedTab } = getContext<TabsContext>('tabs');
</script>

<label class="tab rounded-xl bg-base-100 border-base-100 p-6">
	<input type="radio" name={group} {value} bind:group={$selectedTab} {checked} aria-label={label} />
	{label}
</label>
