<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { infoPanelStore } from '$lib/stores/infoPanelStore';

	const dispatch = createEventDispatcher();

	let title = '';
	let content = '';

	function save() {
		dispatch('save', { title, content });
	}

	function close() {
		infoPanelStore.hideForm();
	}
</script>

<div class="p-4 relative">
	<button
		type="button"
		class="absolute top-2 right-2 text-lg w-6 h-6 flex items-center justify-center hover:text-red-700"
		on:click={close}
		aria-label="Close form"
	>
		×
	</button>
	<div class="form-control">
		<input
			type="text"
			id="title"
			bind:value={title}
			class="input input-bordered"
			placeholder="Title"
		/>
	</div>
	<div class="form-control mt-4">
		<textarea
			id="content"
			bind:value={content}
			class="textarea textarea-bordered h-48"
			placeholder="Write an epic tale"
		></textarea>
	</div>
	<div class="mt-4">
		<button class="btn btn-primary" on:click={save}>Create!</button>
	</div>
</div>
