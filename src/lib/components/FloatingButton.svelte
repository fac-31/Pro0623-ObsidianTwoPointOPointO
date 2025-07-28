<script>
	const menuId = 'floating-action-menu';
</script>

<div class="dropdown dropdown-top dropdown-center fixed bottom-6 right-6">
	<button
		aria-label="Floating action dropdown"
		aria-haspopup="true"
		aria-controls={menuId}
		class="btn m-1 text-2xl bg-secondary text-primary-content rounded-full shadow-lg hover:bg-primary-focus focus:outline-none focus:ring-4 focus:ring-primary/50"
	>
		+
	</button>

	<ul
		id={menuId}
		role="menu"
		class="dropdown-content menu bg-base-100 rounded-box z-10 w-52 p-2 shadow-sm"
	>
		<li role="presentation">
			<button role="menuitem" type="button">Display Text</button>
		</li>
		<li role="presentation">
			<button role="menuitem" type="button">Create New</button>
		</li>
	</ul>
</div>
