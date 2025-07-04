import { createBrowserClient, createServerClient, isBrowser } from '@supabase/ssr';
import neo4j from 'neo4j-driver';
import {
	PUBLIC_NEO4J_URL,
	PUBLIC_NEO4J_USERNAME,
	PUBLIC_NEO4J_PASSWORD,
	PUBLIC_SUPABASE_URL,
	PUBLIC_SUPABASE_ANON_KEY
} from '$env/static/public';
import type { LayoutLoad } from './$types';

const neo4jConfig = {
	url: PUBLIC_NEO4J_URL,
	username: PUBLIC_NEO4J_USERNAME,
	password: PUBLIC_NEO4J_PASSWORD
};

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

	const driver = neo4j.driver(
		neo4jConfig.url,
		neo4j.auth.basic(neo4jConfig.username, neo4jConfig.password)
	);

	if (!user) {
		return { session, supabase, driver, user: null };
	}

	return { session, supabase, driver, user };
};
