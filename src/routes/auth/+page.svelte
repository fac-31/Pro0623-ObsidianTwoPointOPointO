<script lang="ts">
	import type { PageProps } from './$types';
	import AuthForm from '$lib/components/AuthForm.svelte';

	const { form }: PageProps = $props();

	let formState = $state();
	formState = form?.state || 'logIn';
</script>

{#if formState === 'logIn'}
	<AuthForm
		action="?/login"
		entries={[
			{ name: 'email', type: 'email' },
			{ name: 'password', type: 'password' }
		]}
		formData={form}
	/>
	<button onclick={() => (formState = 'signUp')}>Don't Have an Account? Sign Up</button>
{:else if formState === 'signUp'}
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
	<button onclick={() => (formState = 'logIn')}>Already Have an Account? Log In</button>
{/if}
