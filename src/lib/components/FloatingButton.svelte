<script lang="ts">
	export let ariaLabel: string = 'Floating action button';
	export let onClick: () => void = () => {};
	export let position: string = 'fixed bottom-6 right-6';
</script>

<button
	class={`${position} w-25 h-25 flex items-center justify-center text-2xl bg-secondary text-primary-content rounded-full shadow-lg hover:bg-primary-focus focus:outline-none focus:ring-4 focus:ring-primary/50`}
	aria-label={ariaLabel}
	on:click={onClick}
>
	+
</button>
