```svelte
<script lang="ts">
	import { invalidate, afterNavigate } from '$app/navigation';
	import { onMount } from 'svelte';
	import '../app.css';
	import { navigating } from '$app/stores';

	const { data, children } = $props();
	const { profile, supabase, session } = $derived(data);

	onMount(() => {
		const { data } = supabase.auth.onAuthStateChange((event, newSession) => {
			if (newSession?.expires_at && session?.expires_at) {
				invalidate('supabase:auth');
			}
		});

		return () => data.subscription.unsubscribe();
	});

	afterNavigate(() => {
		const h1 = document.querySelector('h1');
		h1?.focus();
	});

	const logout = async () => {
		await supabase.auth.signOut();
		invalidate('supabase:auth');
	};
</script>

<svelte:head>
	<title>{profile ? `Hello ${profile.properties.name}` : 'Billys World'}</title>
</svelte:head>

{#if $navigating}
	<div role="status" aria-live="polite">
		<span class="sr-only">Loading page...</span>
	</div>
{/if}

<a href="#main-content" class="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4 focus:bg-base-300 focus:text-base-content">
	Skip to main content
</a>

<!-- Global layout wrapper -->
<div class="flex flex-col h-screen">
	<header class="bg-base-200 p-2 flex items-center justify-between" role="banner">
		{#if profile}
			<h1 class="text-xl font-bold" tabindex="-1">Hello {profile.properties.name}</h1>
			<button class="btn btn-secondary btn-sm" on:click={logout}>Log Out</button>
		{:else}
			<h1 class="text-xl font-bold" tabindex="-1">Billys World</h1>
			<a href="/auth" class="btn btn-secondary btn-sm">Log In</a>
		{/if}
	</header>
	<main class="flex-1" id="main-content">
		{@render children()}
	</main>
</div>
```
