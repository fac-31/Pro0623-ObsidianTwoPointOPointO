<script lang="ts">
	const { action, formData } = $props();
</script>

<form method="POST" {action}>
	{#if formData?.error}<p class="error">{formData?.message}</p>{/if}
	{#each Object.entries(formData) as [key, value]}
		<label>
			{key}
			<input name={key} type={key === 'password' ? 'password' : 'text'} value={value ?? ''} />
		</label>
	{/each}
	<button class="button">Log In</button>
</form>
