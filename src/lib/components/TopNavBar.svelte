<script lang="ts">
	import { page } from '$app/stores';

	const { session, supabase } = $page.data;

	async function handleSignOut() {
		if (!supabase) return;
		await supabase.auth.signOut();
	}
</script>

<div class="navbar bg-base-100">
	<div class="navbar-start">
		<a href="/" class="btn btn-ghost text-xl">Billy's World</a>
	</div>
	<div class="navbar-center">
		<slot />
	</div>
</div>
