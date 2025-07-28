<script lang="ts">
	function handleSubmit() {
		alert('fetch');
	}
</script>

<div class="rounded-4xl border-3 border-bg-base-300 text-base p-4 h-full flex flex-col">
	<form class="p-1 rounded-xl h-full w-full relative" on:submit|preventDefault={handleSubmit}>
		<label for="query-textarea" class="sr-only">Ask me something</label>
		<textarea
			id="query-textarea"
			class="textarea border-none resize-none w-full h-full"
			placeholder="Ask me something"
		></textarea>
		<div class="absolute bottom-4 right-6">
			<button type="submit" class="btn btn-ghost btn-lg">Submit</button>
		</div>
	</form>
</div>
I have corrected the code in `src/lib/components/QueryPanel.svelte` and updated `PR.md` with the details of the accessibility improvements.
