<script lang="ts">
	import Tabs from './Tabs.svelte';
	import { tabsStore, activeTab } from '$lib/stores/tabs';
	import SettingsMenu from './SettingsMenu.svelte';
	import { infoPanelStore } from '$lib/stores/infoPanelStore';
	import CreateNewForm from './CreateNewForm.svelte';
	import { createEventDispatcher } from 'svelte';
	import CreateWorld from './CreateWorld.svelte';
	import type { GraphData } from '$lib/types/graph';

	const dispatch = createEventDispatcher();

	export let worldId: string;
	export let graphTitle: string;
	export let buttons: {
		label: string;
		onClick: () => void;
		class?: string;
		location?: string;
	}[] = [];
	export let worldContent: string | undefined = undefined;
	export let explanation: string;
	export let editedContent: string | undefined;
	export let graphData: GraphData;

	$: adjacencyList = (() => {
		if (!$activeTab || !graphData) return [];

		const connections: string[] = [];
		const activeNodeId = $activeTab.data.id;

		// Helper to get node label by ID
		const getNodeLabel = (nodeId: string) => {
			const node = graphData.nodes.find((n) => n.data.id === nodeId);
			return node?.data.label || node?.data.name || nodeId;
		};

		for (const edge of graphData.edges) {
			if (edge.data.source === activeNodeId) {
				connections.push(`${edge.data.label} -> ${getNodeLabel(edge.data.target)}`);
			} else if (edge.data.target === activeNodeId) {
				connections.push(`${getNodeLabel(edge.data.source)} <- ${edge.data.label}`);
			}
		}
		return connections;
	})();

	$: tabs = $tabsStore.tabs.map((t) => ({
		id: t.data.id,
		label: t.data.name
	}));

	$: useDropdown = tabs.length > 4;

	function handleSelect(event: Event) {
		const selectedId = (event.target as HTMLSelectElement).value;
		tabsStore.setActiveTab(selectedId);
	}

	async function handleSave(event: CustomEvent) {
		console.log('Save clicked:', event.detail);

		try {
			const response = await fetch('/api/documents/create', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					...event.detail // This includes title and content
				})
			});

			if (!response.ok) {
				const errorResult = await response.json();
				throw new Error(errorResult.message || 'Failed to save document');
			}

			const { document: newDocument } = await response.json();

			const newNodeForGraph = {
				data: {
					name: newDocument.title,
					id: newDocument.id,
					label: newDocument.properties.title,
					content: newDocument.properties.content,
					type: newDocument.labels[0]
				}
			};

			dispatch('documentCreated', { node: newNodeForGraph });

			tabsStore.addTab(newNodeForGraph);
			tabsStore.setActiveTab(newNodeForGraph.data.id);
		} catch (error) {
			console.error('Error saving document:', error);
		} finally {
			infoPanelStore.hideForm();
		}
	}
</script>

<!-- TABS ABOVE PANEL -->
{#if !$infoPanelStore.showCreateNewForm && tabs.length > 0}
	<div class="mb-2">
		{#if useDropdown}
			<div class="flex items-center">
				<select class="select select-bordered w-full ml-2" on:change={handleSelect}>
					{#each tabs as tab (tab.id)}
						<option value={tab.id} selected={tab.id === $tabsStore.activeTabId}>
							{tab.label}
						</option>
					{/each}
				</select>
			</div>
		{:else}
			<Tabs
				{tabs}
				activeTabId={$tabsStore.activeTabId}
				setActiveTab={tabsStore.setActiveTab}
				closeTab={tabsStore.removeTab}
			/>
		{/if}
	</div>
{/if}

<!-- MAIN INFO PANEL CONTENT -->
<div class="rounded-4xl border-3 border-bg-base-300 text-base p-4 h-full w-full flex flex-col">
	{#if $infoPanelStore.showCreateNewForm}
		<CreateNewForm on:save={handleSave} />
	{:else}
		<div class="flex-1 rounded-xl overflow-hidden p-2 flex gap-4 min-h-0">
			<!-- Left content area -->
			<div class="flex-1 overflow-auto">
				{#if $activeTab?.data.type === 'settings'}
					<SettingsMenu />
				{:else if $activeTab?.data.type === 'create-world'}
					<CreateWorld />
				{:else if $activeTab}
					<!-- Header: name, type badge, buttons -->
					<div class="flex flex-wrap items-center gap-4 mb-2">
						<h2 class="text-xl font-semibold">{$activeTab.data.name}</h2>
						<div class="badge badge-outline">{$activeTab.data.type}</div>
						{console.log('asdfasdf ', JSON.stringify($activeTab.data))}
						{#if buttons.length && $activeTab?.data.type !== 'User'}
							{console.log('asdfasdfasdf: ', JSON.stringify($activeTab?.data))}
							<div class="flex gap-2 flex-wrap">
								{#each buttons.filter((b) => b.location === 'header') as button (button.label)}
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

					<!-- Content (or no content): on new line -->
					{#if $activeTab.editing}
						<textarea class="textarea textarea-bordered w-full" bind:value={editedContent}
						></textarea>
						<div class="flex gap-2 mt-2">
							{#each buttons.filter((b) => b.location === 'content') as button (button.label)}
								<button class={`btn ${button.class ?? ''}`} on:click={button.onClick}>
									{button.label}
								</button>
							{/each}
						</div>
					{:else if $activeTab.data.content}
						<div class="prose max-w-none mt-2">
							{$activeTab.data.content}
						</div>
					{:else}
						<p class="text-gray-400 italic mt-2">No content</p>
					{/if}

					{#if adjacencyList.length > 0}
						<h3 class="text-lg font-semibold mt-4">Connections:</h3>
						<ul class="list-disc list-inside ml-4">
							{#each adjacencyList as connection}
								<li>{connection}</li>
							{/each}
						</ul>
					{/if}
				{:else if graphTitle}
					<!-- Default Message if no tab is active -->
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
