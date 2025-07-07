import { redirect } from '@sveltejs/kit';
import { fail } from '@sveltejs/kit';

import type { Actions } from './$types';
import driver from '$lib/db/neo4j';
import type { Neo4jError } from 'neo4j-driver';

export const actions: Actions = {
	login: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const email = formData.get('email') as string;
		const password = formData.get('password') as string;

		const { error } = await supabase.auth.signInWithPassword({ email, password });

		if (error) {
			return fail(400, { email, error: true, message: error.message, state: 'logIn' });
		} else {
			throw redirect(303, '/');
		}
	},
	signup: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const username = formData.get('username') as string;
		const email = formData.get('email') as string;
		const password = formData.get('password') as string;
		const passwordCheck = formData.get('password-check') as string;

		// Check if email already exists
		const neo4jsession = driver.session();
		try {
			const result = await neo4jsession.executeRead((tx) =>
				tx.run('MATCH (u:User {email: $email}) RETURN u as User', {
					email: email
				})
			);
			if (result.records.length > 0) {
				return fail(400, {
					username,
					email,
					error: true,
					message: 'Email already in use',
					state: 'signUp'
				});
			}
		} catch (error) {
			console.error('Error:', error);
			return fail(400, {
				username,
				email,
				error: true,
				message: (error as Neo4jError).message,
				state: 'signUp'
			});
		} finally {
			await neo4jsession.close();
		}

		// Check if passwords match
		if (password !== passwordCheck) {
			return fail(400, {
				username,
				email,
				error: true,
				message: 'Passwords do not match',
				state: 'signUp'
			});
		}

		// Sign Up with Supabase
		const { data, error } = await supabase.auth.signUp({ email, password });

		if (error) {
			console.error('Signup error:', error);
			return fail(400, { username, email, error: true, message: error.message, state: 'signUp' });
		}

		// Create User Node in Neo4j
		if (data.user) {
			const neo4jsession = driver.session();
			try {
				await neo4jsession.executeWrite((tx) =>
					tx.run('MERGE (u:User {name: $name, authid: $authid, email: $email})', {
						name: username,
						authid: data?.user?.id,
						email: email
					})
				);
			} catch (error) {
				// If there is an error on Neo4j user creation, delete the user auth from Supabase
				console.error('Error:', error);
				await supabase.auth.admin.deleteUser(data.user.id);
				return fail(400, {
					username,
					email,
					error: true,
					message: (error as Neo4jError).message,
					state: 'signUp'
				});
			} finally {
				await neo4jsession.close();
			}
		}

		throw redirect(303, '/');
	}
};
