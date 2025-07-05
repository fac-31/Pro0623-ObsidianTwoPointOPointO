<script lang="ts">
	let selectedTab = 'tab2'; // default active tab
</script>

<div class="rounded-xl bg-secondary text-primary-content p-4 h-full w-full">
	<h2 class="font-bold text-lg mb-4">Top Right</h2>

	<div class="tabs tabs-lift mb-4">
		<input
			type="radio"
			id="tab1"
			name="my_tabs_3"
			class="tab"
			aria-label="Tab 1"
			bind:group={selectedTab}
			value="tab1"
		/>
		<label for="tab1" class="tab cursor-pointer">Tab 1</label>

		<input
			type="radio"
			id="tab2"
			name="my_tabs_3"
			class="tab"
			aria-label="Tab 2"
			bind:group={selectedTab}
			value="tab2"
		/>
		<label for="tab2" class="tab cursor-pointer">Tab 2</label>

		<input
			type="radio"
			id="tab3"
			name="my_tabs_3"
			class="tab"
			aria-label="Tab 3"
			bind:group={selectedTab}
			value="tab3"
		/>
		<label for="tab3" class="tab cursor-pointer">Tab 3</label>
	</div>

	<div class="tab-content bg-base-100 border-base-300 p-6 rounded-b-lg">
		{#if selectedTab === 'tab1'}
			<p>Tab content 1</p>
		{:else if selectedTab === 'tab2'}
			<p>Tab content 2</p>
		{:else if selectedTab === 'tab3'}
			<p>Tab content 3</p>
		{/if}
	</div>
</div>
