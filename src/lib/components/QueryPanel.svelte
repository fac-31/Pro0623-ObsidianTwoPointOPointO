<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	export let worldId: string;
	let query = '';
	let loading = false;
	let error = '';

	function handleKeyDown(event: KeyboardEvent) {
		if (event.key === 'Enter' && !event.shiftKey) {
			event.preventDefault();
			handleSubmit(event);
		}
	}

	async function handleSubmit(event: Event) {
		event.preventDefault();
		error = '';

		console.log(worldId);

		try {
			const res = await fetch('/api/query', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ query, worldId })
			});

			if (!res.ok) {
				throw new Error(`Server error: ${res.status}`);
			}

			const response = await res.json();
			console.log('Response from /api/query:', response);
			dispatch('result', response);
			query = '';
		} catch (err: unknown) {
			let errorMessage = 'Unknown error occurred';
			if (err instanceof Error) {
				errorMessage = err.message;
			} else if (typeof err === 'string') {
				errorMessage = err;
			}
			console.error(errorMessage);
		} finally {
			loading = false;
		}
	}
</script>

<div class="rounded-4xl border-3 border-bg-base-300 text-base p-4 h-full flex flex-col">
	<div class="p-1 rounded-xl h-full w-full relative">
		<form on:submit|preventDefault={handleSubmit}>
			<textarea
				class="textarea textarea-ghost w-full h-32 rounded-xl"
				placeholder="Ask me something"
				id="query"
				bind:value={query}
				on:keydown={handleKeyDown}
				required
			></textarea>
		</form>
		<div class="absolute bottom-4 right-6">
			<button class="btn btn-ghost btn-lg" type="submit">Submit</button>
		</div>
	</div>
</div>
