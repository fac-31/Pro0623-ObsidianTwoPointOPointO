<script lang="ts">
	import type { PageProps } from './$types';
	import AuthForm from '$lib/components/AuthForm.svelte';

	const { form }: PageProps = $props();
</script>



<AuthForm
	action="?/login"
	entries={[
		{ name: 'email', type: 'email' },
		{ name: 'password', type: 'password' }
	]}
	formData={form}
/>
