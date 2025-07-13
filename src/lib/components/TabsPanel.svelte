<script lang="ts">
	export let content: string = '';
	export let onSave: () => void = () => {};
	export let onDelete: () => void = () => {};
</script>

<div class="relative h-full w-full flex flex-col justify-between">
	<p class="rounded-xl bg-base-100 border-base-100 text-base p-4 h-full w-full">
		{content}
	</p>
	<div class="flex justify-end gap-2 mt-4">
		<button class="btn btn-secondary" on:click={onDelete}>Delete</button>
		<button class="btn btn-primary" on:click={onSave}>Save</button>
	</div>
</div>
