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

		console.log('Login form data:', { email, password });

		const { error } = await supabase.auth.signInWithPassword({ email, password });

		if (error) {
			return fail(400, { email, password, error: true, message: error.message });
		} else {
			redirect(303, '/');
		}
	},
	signup: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const username = formData.get('username') as string;
		const email = formData.get('email') as string;
		const password = formData.get('password') as string;
		const passwordCheck = formData.get('password-check') as string;

		if (password !== passwordCheck) {
			return fail(400, { username, email, error: true, message: 'Passwords do not match' });
		}

		const { data, error } = await supabase.auth.signUp({ email, password });

		console.log('Signup data:', data);
		console.log('Signup error:', error);

		if (error) {
			console.error('Signup error:', error);
			return fail(400, { username, email, error: true, message: error.message });
		}

		if (data.user) {
			const neo4jsession = driver.session();
			try {
				await neo4jsession.executeWrite((tx) =>
					tx.run('MERGE (u:User {name: $name, authid: $authid})', {
						name: username,
						authid: data?.user?.id
					})
				);
			} catch (error) {
				console.error('Error:', error);
				await supabase.auth.admin.deleteUser(data.user.id);
				return fail(400, { username, email, error: true, message: (error as Neo4jError).message });
			} finally {
				await neo4jsession.close();
			}
		}

		redirect(303, '/');
	}
};
