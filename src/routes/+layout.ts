import { createBrowserClient, createServerClient, isBrowser } from '@supabase/ssr';
import driver from '$lib/db/neo4j';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import type { LayoutLoad } from './$types';
import type { Node, Integer } from 'neo4j-driver';

export const load: LayoutLoad = async ({ data, depends, fetch }) => {
	/**
	 * Declare a dependency so the layout can be invalidated, for example, on
	 * session refresh.
	 */
	depends('supabase:auth');

	const supabase = isBrowser()
		? createBrowserClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
				global: {
					fetch
				}
			})
		: createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
				global: {
					fetch
				},
				cookies: {
					getAll() {
						return data.cookies;
					}
				}
			});

	/**
	 * It's fine to use `getSession` here, because on the client, `getSession` is
	 * safe, and on the server, it reads `session` from the `LayoutData`, which
	 * safely checked the session using `safeGetSession`.
	 */
	const {
		data: { session }
	} = await supabase.auth.getSession();

	const {
		data: { user }
	} = await supabase.auth.getUser();

	if (!user) {
		return { session, supabase, user: null, profile: null };
	}

	console.log('User:', user);

	interface UserProps {
		name: string;
		authid: string;
	}

	type User = Node<Integer, UserProps>;

	let profile: User;
	const neo4jsession = driver.session();
	try {
		const res = await neo4jsession.executeWrite((tx) =>
			tx.run('MATCH (u:User {authid: $authid}) RETURN u as User', { authid: user.id })
		);
		profile = res.records[0].get('User');
	} catch (error) {
		console.error('Error:', error);
		return { session, supabase, user, profile: null };
	} finally {
		await neo4jsession.close();
	}

	return { session, supabase, user, profile };
};
