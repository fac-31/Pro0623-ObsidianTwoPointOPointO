<script lang="ts">
	import type { ActionData } from '../../routes/auth/login/$types';

	type Entry = {
		name: string;
		type: string;
	};

	interface AuthFormProps {
		entries: Entry[];
		action: string;
		formData: ActionData;
	}

	const { entries, action, formData }: AuthFormProps = $props();
</script>

<form method="POST" {action}>
	{#if formData?.error}<p class="error">{formData?.message}</p>{/if}
	{#each entries as entry}
		<label>
			{entry.name}
			<input name={entry.name} type={entry.type} value={''} />
		</label>
	{/each}
	<button class="button">Log In</button>
</form>
