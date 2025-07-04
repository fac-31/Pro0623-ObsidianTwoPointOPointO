<script lang="ts">
	import type { PageProps } from './$types';
	import AuthForm from '$lib/components/AuthForm.svelte';

	const { form }: PageProps = $props();

	let loggingIn = $state(true);
</script>

{#if loggingIn}
	<AuthForm
		action="?/login"
		entries={[
			{ name: 'email', type: 'email' },
			{ name: 'password', type: 'password' }
		]}
		formData={form}
	/>
{:else}
	<AuthForm
		action="?/signup"
		entries={[
			{ name: 'username', type: 'text' },
			{ name: 'email', type: 'email' },
			{ name: 'password', type: 'password' },
			{ name: 'password-check', type: 'password' }
		]}
		formData={form}
	/>
{/if}
<button onclick={() => (loggingIn = !loggingIn)}>{loggingIn ? 'Sign Up' : 'Log In'}</button>
