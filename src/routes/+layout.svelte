<script lang="ts">
	import { invalidate } from '$app/navigation';
	import { onMount } from 'svelte';
	import '../app.css';

	const { data, children } = $props();
	const { supabase, session, profile } = $derived(data);

	onMount(() => {
		const { data } = supabase.auth.onAuthStateChange((event, newSession) => {
			if (newSession?.expires_at && session?.expires_at) {
				invalidate('supabase:auth');
			}
		});

		return () => data.subscription.unsubscribe();
	});

	const logout = async () => {
		await supabase.auth.signOut();
		invalidate('supabase:auth');
		location.reload();
	};
</script>

<!-- Global layout wrapper -->
<div class="flex flex-col h-screen">
	<header class="bg-base-200 p-2 flex items-center justify-between">
		{#if profile}
			<h1 class="text-xl font-bold">Hello {profile.properties.name}</h1>
			<button class="btn btn-secondary btn-sm" onclick={logout}>Log Out</button>
		{:else}
			<h1 class="text-xl font-bold">Billys World</h1>
			<a href="auth" class="btn btn-secondary btn-sm">Log In</a>
		{/if}
	</header>
	<main class="flex-1">
		{@render children()}
	</main>
</div>
