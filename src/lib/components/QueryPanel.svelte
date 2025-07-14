<script lang="ts">
	function handleClick() {
		alert('fetch');
	}
</script>

<div class="rounded-xl bg-base-300 text-base p-4 h-full w-full">
	<div class="bg-base-100 p-6 rounded-xl h-full w-full">
		<textarea class="textarea textarea-ghost w-full h-32 rounded-xl" placeholder="Ask me something"
		></textarea>
		<button class="btn btn-secondary mt-2" on:click={handleClick}>Enter</button>
	</div>
</div>
