import type { LayoutServerLoad } from './$types';
import driver from '$lib/db/neo4j';
import type { Node, Integer } from 'neo4j-driver';

export const load: LayoutServerLoad = async ({ locals: { safeGetSession } }) => {
	const { session, user } = await safeGetSession();

	if (!user) {
		return { session, user, profile: null };
	}

	interface UserProps {
		name: string;
		authid: string;
	}

	type User = Node<Integer, UserProps>;

	let profile: User | null = null;
	const neo4jsession = driver.session();
	try {
		const res = await neo4jsession.executeWrite((tx) =>
			tx.run('MATCH (u:User {authid: $authid}) RETURN u as User', { authid: user.id })
		);
		if (res.records.length > 0) {
			profile = res.records[0].get('User');
		}
	} catch (error) {
		console.error('Error fetching profile in layout.server.ts:', error);
	} finally {
		await neo4jsession.close();
	}

	return {
		session,
		user,
		profile: profile
			? {
					elementId: profile.elementId,
					labels: profile.labels,
					properties: profile.properties
				}
			: null
	};
};
