<script lang="ts">
	import Tabs from './Tabs.svelte';
	import { selectedNodesStore, activeNode } from '$lib/stores/selectedNodes';
	import { infoPanelStore } from '$lib/stores/infoPanelStore';
	import CreateNewForm from './CreateNewForm.svelte';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	export let worldId: string;
	export let graphTitle: string;
	export let buttons: { label: string; onClick: () => void; class?: string }[] = [];
	export let worldContent: string | undefined = undefined;
	export const explanation: string = '';

	$: tabs = $selectedNodesStore.nodes.map((n) => ({
		id: n.data.id,
		label: n.data.name || n.data.title
	}));

	$: useDropdown = tabs.length > 10;

	function handleSelect(event: Event) {
		const selectedId = (event.target as HTMLSelectElement).value;
		selectedNodesStore.setActiveNode(selectedId);
	}

	async function handleSave(event: CustomEvent) {
		console.log('Save clicked:', event.detail);
		console.log('WorldId', worldId);

		try {
			const response = await fetch('/api/documents/create', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					...event.detail,
					worldId
				})
			});

			if (!response.ok) {
				const errorResult = await response.json();
				throw new Error(errorResult.message || 'Failed to save document');
			}

			const { document: newDocument } = await response.json();

			// Create a node format that the graph and tabs can use
			const newNodeForGraph = {
				data: {
					name: newDocument.title,
					id: newDocument.id,
					label: newDocument.properties.title,
					content: newDocument.properties.content,
					type: newDocument.labels[0]
				}
			};

			// Dispatch event to update the main graph
			dispatch('documentCreated', { node: newNodeForGraph });

			// Add to the tabs in the info panel and make it active
			selectedNodesStore.addNode(newNodeForGraph);
			selectedNodesStore.setActiveNode(newNodeForGraph.data.id);
		} catch (error) {
			console.error('Error saving document:', error);
			// Optionally, show an error notification to the user
		} finally {
			infoPanelStore.hideForm();
		}
	}
</script>

<div class="rounded-4xl border-3 border-bg-base-300 text-base p-4 h-full w-full flex flex-col">
	{#if $infoPanelStore.showCreateNewForm}
		<CreateNewForm on:save={handleSave} />
	{:else}
		{#if tabs.length > 0}
			{#if useDropdown}
				<div class="flex items-center">
					<span class="font-bold">Tab:</span>
					<select class="select select-bordered w-full max-w-xs" on:change={handleSelect}>
						{#each tabs as tab (tab.id)}
							<option value={tab.id} selected={tab.id === $selectedNodesStore.activeNodeId}
								>{tab.label}</option
							>
						{/each}
					</select>
				</div>
			{:else}
				<Tabs
					{tabs}
					activeTabId={$selectedNodesStore.activeNodeId}
					setActiveTab={selectedNodesStore.setActiveNode}
					closeTab={selectedNodesStore.removeNode}
				/>
			{/if}
		{/if}

		<div class="flex-1 rounded-xl overflow-hidden p-2 flex gap-4 min-h-0">
			<!-- Left content area -->
			<div class="flex-1 overflow-auto">
				{#if $activeNode}
					<div class="flex flex-wrap items-center gap-4 mb-2">
						<h2 class="text-xl font-semibold">{$activeNode.data.label}</h2>
						{#if buttons.length}
							<div class="flex gap-2 flex-wrap">
								{#each buttons as button (button.label)}
									<button
										class={`btn btn-sm ${button.class ?? 'btn-secondary'}`}
										on:click={button.onClick}
									>
										{button.label}
									</button>
								{/each}
							</div>
						{/if}
					</div>
					<p>{$activeNode.data.content}</p>
				{:else if graphTitle}
					<h2 class="text-xl font-semibold">{graphTitle}</h2>
					{#if worldContent}
						<p>{worldContent}</p>
					{/if}
				{:else}
					<p class="text-gray-400 italic">No node selected.</p>
				{/if}
			</div>
		</div>
	{/if}
</div>
