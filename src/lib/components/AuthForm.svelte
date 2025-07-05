<script lang="ts">
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

	const { entries, action, buttonText, formData }: AuthFormProps = $props();
</script>

<form method="POST" {action} class="flex flex-col gap-2 m-4">
	{#if formData?.error}<p class="error">{formData?.message}</p>{/if}
	{#each entries as entry (entry.name)}
		<label for={entry.name} class="flex flex-col gap-2">
			{entry.label}
			<input
				class="border border-gray-300 rounded-md p-2"
				name={entry.name}
				type={entry.type}
				value={formData?.[entry.name as keyof typeof formData] || ''}
			/>
		</label>
	{/each}
	<button class="bg-purple-800 text-white p-2 rounded-md cursor-pointer">{buttonText}</button>
</form>
