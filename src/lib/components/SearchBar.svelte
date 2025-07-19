<script lang="ts">
	function handleSubmit(event: SubmitEvent) {
		event.preventDefault();
		console.log('Search form submitted');
	}
</script>

<form class="flex justify-center w-full" role="search" on:submit={handleSubmit}>
	<label for="search-input" class="sr-only">Search</label>
	<input
		id="search-input"
		type="search"
		placeholder="Search..."
		class="input input-bordered w-1/2"
		aria-label="Search"
	/>
	<button type="submit" class="btn btn-square" aria-label="Submit search">
		<svg
			xmlns="http://www.w3.org/2000/svg"
			class="h-6 w-6"
			fill="none"
			viewBox="0 0 24 24"
			stroke="currentColor"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
			/>
		</svg>
	</button>
</form>
