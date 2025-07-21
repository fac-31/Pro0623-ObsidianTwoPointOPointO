<script lang="ts">
	function handleClick() {
		alert('fetch');
	}
</script>

<div class="rounded-4xl border-3 border-bg-base-300 text-base p-4 h-full flex flex-col">
	<div class="p-1 rounded-xl h-full w-full relative">
		<textarea class="textarea border-none resize-none w-full h-full" placeholder="Ask me something"
		></textarea>
		<div class="absolute bottom-4 right-6">
			<button class="btn btn-ghost btn-lg" on:click={handleClick}> Submit</button>
		</div>
	</div>
</div>
