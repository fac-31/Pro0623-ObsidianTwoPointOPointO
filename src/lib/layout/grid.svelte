<script>
	import Main from '../layout/main.svelte';
	import TopRight from '../layout/topright.svelte';
	import BottomRight from '../layout/bottomright.svelte';
</script>

<div class="grid grid-cols-[2fr_1fr] grid-rows-[2fr_1fr] gap-4 h-screen p-4">
	<div class="row-span-2"><Main /></div>
	<div><TopRight /></div>
	<div><BottomRight /></div>
</div>
