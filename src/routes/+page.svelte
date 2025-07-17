<script lang="ts">
	import driver from '$lib/db/neo4j';
	import { Integer, Neo4jError, Node, Session } from 'neo4j-driver';
	import seedData from '$lib/utils/create-utils';

	interface UserProps {
		name: string;
		authid: string;
	}

	let id = 'someid';

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

<main class="max-w-xl mx-auto p-4 space-y-6 text-sm">
	<h1 class="text-xl font-semibold">Welcome to Obsidian 2.0.0 DEV PAGE😎</h1>

	<a
		href={`/worlds/${id}`}
		class="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
	>
		Tester Dashboard
	</a>

	<a
		href="/worlds/"
		class="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
	>
		To Worlds
	</a>
	<p>
		Visit
		<a href="https://svelte.dev/docs/kit" class="underline text-blue-600"> svelte.dev/docs/kit </a>
		to read the documentation
	</p>

	{#if errorMessage}
		<p class="text-red-600">Error: {errorMessage}</p>
	{/if}

	<button onclick={() => send(readUsers)} class="px-3 py-1 border rounded hover:bg-gray-100">
		Get Users
	</button>

	{#if users}
		<ul class="list-disc list-inside">
			{#each users as user (user.identity)}
				<li>{user.properties.name}</li>
			{/each}
		</ul>
	{/if}

	<h2 class="text-lg font-medium">Add New User</h2>
	<form onsubmit={() => send(writeUser)} class="space-y-2">
		<label class="block">
			User
			<input type="text" bind:value={newName} class="block mt-1 border px-2 py-1 w-full rounded" />
		</label>
		<button type="submit" class="px-3 py-1 border rounded hover:bg-gray-100"> Add User </button>
	</form>

	{#if newUser}
		<p>New User <strong>{newUser.properties.name}</strong> Created</p>
	{/if}

	<h2 class="text-lg font-medium">Delete User</h2>
	<form onsubmit={() => send(deleteUser)} class="space-y-2">
		<label class="block">
			User
			<input
				type="text"
				bind:value={deleteName}
				class="block mt-1 border px-2 py-1 w-full rounded"
			/>
		</label>
		<button type="submit" class="px-3 py-1 border rounded hover:bg-gray-100"> Delete User </button>
	</form>
	<div>
		<button onclick={seedData} class="px-3 py-1 border rounded hover:bg-gray-100"
			>Seed Data Button</button
		>
		<p>But there's no need because the db is already seeded!</p>
	</div>
</main>
