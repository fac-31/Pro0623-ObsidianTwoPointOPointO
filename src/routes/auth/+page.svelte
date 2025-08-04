<svelte:head>
	<title>Login / Signup</title>
</svelte:head>

<script lang="ts">
	import type { PageProps } from './$types';
	import AuthForm from '$lib/components/AuthForm.svelte';

	const { form }: PageProps = $props();

	let formState = $state();
	formState = form?.state || 'logIn';

	const toggleForm = (toState: string) => {
		formState = toState;
		form!.error = false;
	};
</script>

<section class="flex flex-col items-center justify-center h-screen">
	{#if formState === 'logIn'}
		<AuthForm
			action="?/login"
			entries={[
				{ name: 'username', label: 'Username', type: 'text' },
				{ name: 'email', label: 'Email', type: 'email' },
				{ name: 'password', label: 'Password', type: 'password' }
			]}
			buttonText="Log In"
			formData={form}
		/>
		<button
			onclick={() => toggleForm('signUp')}
			class="text-sm text-black hover:underline cursor-pointer"
		>
			Don't Have an Account? Sign Up
		</button>
	{:else if formState === 'signUp'}
		<AuthForm
			action="?/signup"
			entries={[
				{ name: 'username', label: 'Username', type: 'text' },
				{ name: 'email', label: 'Email', type: 'email' },
				{ name: 'password', label: 'Password', type: 'password' },
				{ name: 'password-check', label: 'Confirm Password', type: 'password' }
			]}
			buttonText="Sign Up"
			formData={form}
		/>
		<button
			onclick={() => toggleForm('logIn')}
			class="text-sm text-black hover:underline cursor-pointer"
		>
			Already Have an Account? Log In
		</button>
	{/if}
</section>
