<script lang="ts">
	import driver from '$lib/db/neo4j';
	import { Integer, Neo4jError, Node, Session } from 'neo4j-driver';
	import type { PageProps } from './$types';

	const { data }: PageProps = $props();

	interface UserProps {
		name: string;
	}

	type User = Node<Integer, UserProps>;

	let users: User[] = $state([]);
	let newUser: User | null = $state(null);
	let newName: string = $state('');
	let deleteName: string = $state('');

	let errorMessage: string = $state('');

	const readUsers = async (session: Session) => {
		newUser = null;
		const res = await session.executeRead((tx) =>
			tx.run('MATCH (u:User) RETURN u AS User LIMIT 10')
		);
		users = res.records.map((record) => record.get('User'));
	};

	const writeUser = async (session: Session) => {
		users = [];
		const res = await session.executeWrite((tx) =>
			tx.run('MERGE (u:User {name: $name}) RETURN u AS User', { name: newName })
		);
		newUser = res.records[0].get('User');
	};

	const deleteUser = async (session: Session) => {
		users = [];
		await session.executeWrite((tx) =>
			tx.run('MATCH (u:User {name: $name}) DETACH DELETE u', { name: deleteName })
		);
	};

	async function send(executeFunction: (session: Session) => void) {
		const session = driver.session();
		errorMessage = '';
		try {
			await executeFunction(session);
		} catch (error) {
			console.error(error);
			if (error instanceof Neo4jError) {
				errorMessage = error.message;
			} else {
				errorMessage = String(error);
			}
		} finally {
			await session.close();
		}
	}
</script>

<h1>Welcome to Obsidian 2.0.0 😎</h1>
<p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>

{#if errorMessage}
	<p>Error: {errorMessage}</p>
{/if}
<button onclick={() => send(readUsers)}>Get Users</button>

{#if users}
	<ul>
		{#each users as user (user.identity)}
			<li>{user.properties.name}</li>
		{/each}
	</ul>
{/if}

<h2>Add New User</h2>
<form onsubmit={() => send(writeUser)}>
	<label>
		User
		<input type="text" bind:value={newName} />
	</label>
	<button type="submit">Add User</button>
</form>

{#if newUser}
	<p>New User <strong>{newUser.properties.name}</strong> Created</p>
{/if}

<h2>Delete User</h2>
<form onsubmit={() => send(deleteUser)}>
	<label>
		User
		<input type="text" bind:value={deleteName} />
	</label>
	<button type="submit">Delete User</button>
</form>
