<script lang="ts">
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';
	import type { ActionData } from '../../routes/auth/$types';

	type Entry = {
		name: string;
		label: string;
		type: string;
		value?: string;
	};

	interface AuthFormProps {
		entries: Entry[];
		action: string;
		buttonText: string;
		formData: ActionData;
	}

	export let { entries, action, buttonText, formData }: AuthFormProps;

	let loading = false;

	const handleSubmit: SubmitFunction = () => {
		loading = true;
		return async ({ update }) => {
			await update();
			loading = false;
		};
	};
</script>

<form method="POST" {action} class="flex flex-col gap-2 m-4" use:enhance={handleSubmit}>
	{#if formData?.error}
		<div role="alert" class="error">
			{formData?.message}
		</div>
	{/if}
	{#each entries as entry (entry.name)}
		<label for={entry.name} class="flex flex-col gap-2">
			{entry.label}
			<input
				class="border border-gray-300 rounded-md p-2"
				id={entry.name}
				name={entry.name}
				type={entry.type}
				value={formData?.[entry.name as keyof typeof formData] || ''}
			/>
		</label>
	{/each}
	<button
		type="submit"
		disabled={loading}
		aria-busy={loading}
		class="bg-purple-800 text-white p-2 rounded-md"
	>
		{#if loading}
			Submitting...
		{:else}
			{buttonText}
		{/if}
	</button>
</form>
