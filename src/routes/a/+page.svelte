<script lang="ts">
	import { Integer, Node } from 'neo4j-driver';
	import type { PageProps } from './$types';

	const { data }: PageProps = $props();
	const { driver, count } = $derived(data);

	const cypher = 'MATCH (p:Project) RETURN p AS Project LIMIT 10';

	interface ProjectProps {
		title: string;
	}

	type Project = Node<Integer, ProjectProps>;

	let projects: Project[] = $state([]);
	let awaiting = $state(false);

	async function send() {
		const session = driver.session();
		awaiting = true;
		try {
			const res = await session.executeRead((tx) => tx.run(cypher));
			projects = res.records.map((record) => record.get('Project'));
		} finally {
			awaiting = false;
			await session.close();
		}
	}
</script>

<h1>Welcome to Obsidian 2.0.0 😎</h1>
<p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>
<button onclick={send}>Get Projects</button>

{#if awaiting}
	<p>loading will take {count} seconds</p>
{:else if projects}
	<ul>
		{#each projects as project (project.identity)}
			<li>{project.properties.title}</li>
		{/each}
	</ul>
{/if}
