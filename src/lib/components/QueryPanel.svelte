<script lang="ts">
	let selectedTab = 'tab1';

	function handleClick() {
		alert('fetch');
	}
</script>

<div class="rounded-xl bg-base-300 text-base p-4 h-full w-full">
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
			<textarea
				class="textarea textarea-ghost w-full h-full rounded-xl"
				placeholder="Ask me something"
			></textarea>

			<button class="btn btn-secondary" on:click={handleClick}>Enter</button>
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
			<textarea
				class="textarea textarea-ghost w-full h-full rounded-xl"
				placeholder="Or give me a command"
			></textarea>

			<button class="btn btn-secondary" on:click={handleClick}>Enter</button>
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
			<textarea
				class="textarea textarea-ghost w-full h-full rounded-xl"
				placeholder="Get me to make something"
			></textarea>

			<button class="btn btn-secondary" on:click={handleClick}>Enter</button>
		</div>
	</div>
</div>

<style>
	.tab-content {
		height: calc(100% - 3rem); /* Adjust based on tab height */
	}
</style>
