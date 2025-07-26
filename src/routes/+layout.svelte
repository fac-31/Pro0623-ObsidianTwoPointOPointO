<script lang="ts">
	import { goto, invalidate } from '$app/navigation';
	import { onMount } from 'svelte';
	import '../app.css';
	import Theme from '$lib/icons/Theme.svelte';
	import { appSettings } from '$lib/stores/appSettings';

	const { data, children } = $props();
	const { profile, supabase, session } = $derived(data);
	const heading = profile?.properties.name || 'Billys World';

	onMount(() => {
		const { data } = supabase.auth.onAuthStateChange((event, newSession) => {
			if (newSession?.expires_at && session?.expires_at) {
				invalidate('supabase:auth');
			}
		});

		return () => data.subscription.unsubscribe();
	});

	const handleAuth = async () => {
		if (profile) {
			await supabase.auth.signOut();
			invalidate('supabase:auth');
		} else {
			goto('/auth');
		}
	};
	const daisyUiThemes = [
		'wireframe',
		'cupcake',
		'emerald',
		'garden',
		'lofi',
		'pastel',
		'fantasy',
		'cmyk',
		'autumn',
		'acid',
		'winter',
		'nord',
		'retro',
		'lemonade',
		'cyberpunk',
		'coffee',
		'dim',
		'sunset',
		'night',
		'luxury',
		'dracula',
		'aqua',
		'forest',
		'dark',
		'synthwave',
		'black'
	];
</script>

<!-- Global layout wrapper -->
<div class="flex flex-col h-screen">
	<header class="bg-base-200 p-2 flex items-center">
		<div class="flex items-center justify-center gap-4 w-full">
			<h1 class="text-2xl font-bold m-2">{heading}</h1>
			<div class="form-control mb-4">
				<label for="theme-select" class="label">Theme</label>
				<select
					id="theme-select"
					class="select select-bordered"
					bind:value={$appSettings.currentTheme}
					onchange={(e) =>
						document.documentElement.setAttribute(
							'data-theme',
							(e.target as HTMLSelectElement).value
						)}
				>
					{#each daisyUiThemes as theme (theme)}
						<option value={theme}>{theme}</option>
					{/each}
				</select>
			</div>
			<button onclick={handleAuth} class="btn btn-secondary btn-sm"
				>{profile ? 'log out' : 'log in'}</button
			>
		</div>
	</header>

	<main class="flex-1">
		{@render children()}
	</main>
</div>

<!-- <header class="bg-base-200 p-2 flex items-center justify-start gap-19">
		{#if profile}
			<h1 class="text-xl font-bold">Hello {profile.properties.name}</h1>
			<button class="btn btn-secondary btn-sm" onclick={logout}>Log Out</button>
		{:else}
			<h1 class="text-xl font-bold">Billys World</h1>
			<a href="/auth" class="btn btn-secondary btn-sm">Log In</a>
		{/if}
		<h2>asdf</h2>
	</header> -->
