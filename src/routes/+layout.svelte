<script lang="ts">
	import { invalidate } from '$app/navigation';
	import { onMount } from 'svelte';

	const { data, children } = $props();
	const { user, supabase, session } = $derived(data);

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

{#if user}
	<h1>Hello {user.id}</h1>
	<button onclick={logout}>Log Out</button>
{:else}
	<a href="auth/login">Log In</a>
{/if}
{@render children()}
