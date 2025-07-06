<script lang="ts">
	import Tabs from './Tabs.svelte';
	import Tab from './Tab.svelte';
	import TabsPanel from './TabsPanel.svelte';

	function handleClickSave() {
		alert('save multiverse');
	}

	function handleClickDelete() {
		alert('delete multiverse');
	}
</script>

<div class="rounded-xl bg-base-300 text-base p-4 h-full w-full">
	<h2 class="font-bold text-lg mb-4">Info</h2>

	<Tabs group="bottom_tabs">
		<Tab name="bottom_tabs" label="Tab 1" value="tab1" checked />
		<TabsPanel value="tab1">
			<p class="rounded-xl bg-base-100 text-base p-4 h-full w-full">Gobledy Goop</p>
			<button class="btn btn-primary" on:click={handleClickSave}>Save</button>
			<button class="btn btn-secondary mr-2" on:click={handleClickDelete}>Delete</button>
		</TabsPanel>

		<Tab name="bottom_tabs" label="Tab 2" value="tab2" />
		<TabsPanel value="tab2">
			<p class="rounded-xl bg-base-100 text-base p-4 h-full w-full">Gobledy Goop Goop</p>
			<button class="btn btn-primary" on:click={handleClickSave}>Save</button>
			<button class="btn btn-secondary mr-2" on:click={handleClickDelete}>Delete</button>
		</TabsPanel>

		<Tab name="bottom_tabs" label="Tab 3" value="tab3" />
		<TabsPanel value="tab3">
			<p class="rounded-xl bg-base-100 text-base p-4 h-full w-full">Gobledy Goop Goop Goop</p>
			<button class="btn btn-primary" on:click={handleClickSave}>Save</button>
			<button class="btn btn-secondary mr-2" on:click={handleClickDelete}>Delete</button>
		</TabsPanel>
	</Tabs>
</div>
