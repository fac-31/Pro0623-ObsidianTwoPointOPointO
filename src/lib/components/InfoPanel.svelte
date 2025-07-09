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
	<Tabs group="bottom_tabs">
		<Tab name="bottom_tabs" label="Tab 1" value="tab1" checked />
		<TabsPanel value="tab1">
			<div class="relative h-full w-full flex flex-col justify-between">
				<p class="rounded-xl bg-base-100 border-base-100 text-base p-4 h-full w-full">
					Gobledy Goop
				</p>
				<div class="flex justify-end gap-2 mt-4">
					<button class="btn btn-secondary" on:click={handleClickDelete}>Delete</button>
					<button class="btn btn-primary" on:click={handleClickSave}>Save</button>
				</div>
			</div>
		</TabsPanel>

		<Tab name="bottom_tabs" label="Tab 2" value="tab2" />
		<TabsPanel value="tab2">
			<div class="relative h-full w-full flex flex-col justify-between">
				<p class="rounded-xl bg-base-100 border-base-100 text-base p-4 h-full w-full">
					Gobledy Goop Goop
				</p>
				<div class="flex justify-end gap-2 mt-4">
					<button class="btn btn-secondary" on:click={handleClickDelete}>Delete</button>
					<button class="btn btn-primary" on:click={handleClickSave}>Save</button>
				</div>
			</div>
		</TabsPanel>

		<Tab name="bottom_tabs" label="Tab 3" value="tab3" />
		<TabsPanel value="tab3">
			<div class="relative h-full w-full flex flex-col justify-between">
				<p class="rounded-xl bg-base-100 border-base-100 text-base p-4 h-full w-full">
					Gobledy Goop Goop Goop
				</p>
				<div class="flex justify-end gap-2 mt-4">
					<button class="btn btn-secondary" on:click={handleClickDelete}>Delete</button>
					<button class="btn btn-primary" on:click={handleClickSave}>Save</button>
				</div>
			</div>
		</TabsPanel>
	</Tabs>
</div>