<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import type { GraphData } from '$lib/types/graph';
	import { tabsStore } from '$lib/stores/tabs';

	const dispatch = createEventDispatcher();

	export let worldId: string;
	export let graphData: GraphData; // Add this line
	let query = '';
	// let loading = false;
	// let error = '';

	function handleKeyDown(event: KeyboardEvent) {
		if (event.key === 'Enter' && !event.shiftKey) {
			event.preventDefault();
			handleSubmit(event);
		}
	}

	// The dumbed down query call
	async function handleDumbSubmit(event: Event) {
		event.preventDefault();

		// Extract and join all document contents
		const joinedContent = graphData.nodes
			.filter((node) => node.data.type === 'Document' && node.data.content)
			.map((node) => node.data.content)
			.join('\n\n---\n\n'); // optional delimiter between docs

		console.log('Sending document content:', joinedContent); // for dev visibility

		try {
			const res = await fetch('/api/dumb-query', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ query, docs: joinedContent })
			});

			if (!res.ok) throw new Error(`Server error: ${res.status}`);

			const response = await res.json();
			console.log('LLM response:', response);

			// Create a new tab with the question as the label and the LLM response as content
			const newTab = {
				data: {
					id: `query-${Date.now()}`,
					name: query, // Use the query as the tab name
					label: query, // Use the query as the tab label
					content: response, // LLM response as content
					type: 'QueryResponse' // A new type for query responses
				}
			};
			tabsStore.addTab(newTab);
			query = '';
		} catch (err) {
			console.error('Error submitting query:', err);
		}
	}

	async function handleSubmit(event: Event) {
		event.preventDefault();

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
		}
	}
</script>

<div class="rounded-4xl border-3 border-bg-base-300 text-base p-4 h-full flex flex-col">
	<div class="p-1 rounded-xl h-full w-full relative">
		<form on:submit|preventDefault={handleDumbSubmit}>
			<textarea
				class="textarea textarea-ghost w-full h-32 rounded-xl"
				placeholder="Ask me something"
				id="query"
				bind:value={query}
				on:keydown={handleKeyDown}
				required
			></textarea>
			<button class="btn btn-ghost btn-lg" type="submit">Submit</button>
		</form>
		<!-- <div class="absolute bottom-4 right-6"></div> -->
	</div>
</div>
