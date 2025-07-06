<script lang="ts">
	let selectedTab = 'tab1';
</script>

<div class="rounded-xl bg-base-300 text-base p-4 h-full w-full">
	<h2 class="font-bold text-lg mb-4">Text Window</h2>

	<div class="tabs tabs-lift">
		<input
			type="radio"
			name="top_tabs"
			class="tab"
			aria-label="Tab 1"
			value="tab1"
			bind:group={selectedTab}
			checked
		/>
		<div class="tab-content bg-base-100 p-6 h-full w-full">
			<textarea class="textarea w-full h-full rounded-xl" placeholder="Ask me something"></textarea>
		</div>

		<input
			type="radio"
			name="top_tabs"
			class="tab"
			aria-label="Tab 2"
			value="tab2"
			bind:group={selectedTab}
		/>
		<div class="tab-content bg-base-100 p-6 h-full w-full">
			<textarea class="textarea w-full h-full rounded-xl" placeholder="Or give me a command"
			></textarea>
		</div>

		<input
			type="radio"
			name="top_tabs"
			class="tab"
			aria-label="Tab 3"
			value="tab3"
			bind:group={selectedTab}
		/>
		<div class="tab-content bg-base-100 p-6 h-full w-full">
			<textarea class="textarea w-full h-full rounded-xl" placeholder="Get me to make something"
			></textarea>
		</div>
	</div>
</div>
