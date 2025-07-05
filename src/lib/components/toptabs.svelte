<script>
	let activeTab = 'commands';
</script>

<div class="w-full">
	<div class="tabs tabs-boxed mb-4">
		<button
			class="tab"
			type="button"
			class:tab-active={activeTab === 'commands'}
			on:click={() => (activeTab = 'commands')}
		>
			Commands
		</button>
		<button
			class="tab"
			type="button"
			class:tab-active={activeTab === 'create'}
			on:click={() => (activeTab = 'create')}
		>
			Create
		</button>
		<button
			class="tab"
			type="button"
			class:tab-active={activeTab === 'edit'}
			on:click={() => (activeTab = 'edit')}
		>
			Edit
		</button>
	</div>

	<div class="bg-base-200 rounded-box p-4">
		{#if activeTab === 'commands'}
			<p>Here you can view all available commands.</p>
		{:else if activeTab === 'create'}
			<p>Use this section to create new items.</p>
		{:else if activeTab === 'edit'}
			<p>Edit existing items here.</p>
		{/if}
	</div>
</div>
