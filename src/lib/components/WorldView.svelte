<script lang="ts">
	import FloatingButton from '$lib/components/FloatingButton.svelte';

	function handleClick() {
		alert('moar multiverses');
	}
</script>

<div class="rounded-xl bg-base-300 text-base p-4 h-full w-full relative">
	<p>The multiverse exists... eventually</p>

	<canvas class="flex-1 w-full rounded-lg bg-base-100"></canvas>

	<FloatingButton
		ariaLabel="moar multiverses"
		onClick={handleClick}
		position="absolute bottom-6 right-6"
	/>
</div>
