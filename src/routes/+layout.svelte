<script lang="ts">
	import { invalidate } from '$app/navigation';
	import { onMount } from 'svelte';
	import '../app.css';

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

	const logout = async () => {
		await supabase.auth.signOut();
		invalidate('supabase:auth');
	};
</script>

<!-- Global layout wrapper -->
<div class="flex flex-col h-screen">
	<header class="bg-base-200 p-2">
		{#if profile}
			<h1 class="text-4xl font-bold m-4">Hello {profile.properties.name}</h1>
			<button
				onclick={logout}
				class="bg-purple-800 text-white p-2 rounded-md absolute top-0 right-0 m-4">Log Out</button
			>
		{:else}
			<a href="auth" class="bg-purple-800 text-white p-2 rounded-md absolute top-0 right-0 m-4"
				>Log In</a
			>
		{/if}
	</header>
	<main class="flex-1">
		{@render children()}
	</main>
</div>
