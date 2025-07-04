<script lang="ts">
	import type { PageProps } from './$types';
	import AuthForm from '$lib/components/AuthForm.svelte';

	const { form }: PageProps = $props();
</script>

<AuthForm action="?/login" formData={form} />
