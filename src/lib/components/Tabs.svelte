<script lang="ts">
	import { setContext } from 'svelte';
	import { writable, type Writable } from 'svelte/store';

	export let group: string = 'tabs';
	const selectedTab: Writable<string> = writable('tab1');

	setContext('tabs', { group, selectedTab });
</script>

<div class="tabs tabs-lifted w-full">
	<slot />
</div>
