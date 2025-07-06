import driver from '$lib/db/neo4j';
import { Session } from 'neo4j-driver';
import data from '$lib/db/seed.json';

interface Edge {
	key: string;
	name: string;
	edge: string;
}

interface Entity {
	key: string;
	type: string;
	name: string;
	properties: Record<string, unknown>[];
	edges: Edge[];
}

const processEntity = async (session: Session, entity: Entity) => {
	await session.executeWrite(async (tx) => {
		const propertiesToSet = entity.properties ? Object.assign({}, ...entity.properties) : {};
		await tx.run(
			`MERGE (n:${entity.type} {name: $name})
			SET n += $props`,
			{ name: entity.name, props: propertiesToSet }
		);

		if (entity.edges) {
			for (const edge of entity.edges) {
				await tx.run(
					`MATCH (source:${entity.type} {name: $sourceName})
					MATCH (target {name: $targetName})
					MERGE (source)-[:${edge.edge}]->(target)`,
					{
						sourceName: entity.name,
						targetName: edge.name
					}
				);
			}
		}
	});
};

async function send(executeFunction: (session: Session) => Promise<void>) {
	console.log('SENDING');
	const session = driver.session();
	try {
		await executeFunction(session);
	} catch (error) {
		console.error(error);
	} finally {
		await session.close();
	}
}

export default function seedData() {
	data.forEach((entity) => {
		send((session) => processEntity(session, entity as unknown as Entity));
	});
}
