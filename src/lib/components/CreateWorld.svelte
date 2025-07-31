<script lang="ts">
	let worldName = '';
	let summary = '';
	let isLoading = false;

	async function handleSubmit(event: Event) {
		event.preventDefault();
		isLoading = true;

		try {
			const response = await fetch('/api/create-world', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					name: worldName,
					content: summary
				})
			});

			if (!response.ok) {
				const error = await response.json();
				throw new Error(error.message || 'Failed to create world');
			}

			const result = await response.json();
			console.log('World created:', result);

			// Optional: reset fields
			worldName = '';
			summary = '';
		} catch (error) {
			console.error('Error creating world:', error);
		} finally {
			isLoading = false;
		}
	}
</script>

<form class="fieldset" on:submit|preventDefault={handleSubmit}>
	<legend class="fieldset-legend">What is your world called?</legend>
	<input type="text" class="input" placeholder="World Name" bind:value={worldName} required />

	<legend class="fieldset-legend">Give a brief summary.</legend>
	<textarea class="textarea" placeholder="Summary" bind:value={summary} required></textarea>

	<button class="btn btn-primary mt-3 max-w-80" type="submit" disabled={isLoading}>
		{isLoading ? 'Creating...' : 'Create'}
	</button>

	{#if isLoading}
		<div class="flex justify-center mt-4">
			<span class="loading loading-ring"></span>
		</div>
	{/if}
</form>
