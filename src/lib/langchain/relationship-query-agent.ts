import { ChatOpenAI } from '@langchain/openai';
import { Neo4jGraph } from '@langchain/community/graphs/neo4j_graph';
import { PUBLIC_NEO4J_URL, PUBLIC_NEO4J_USERNAME, PUBLIC_NEO4J_PASSWORD } from '$env/static/public';
import { HumanMessage } from '@langchain/core/messages';
import type { GraphData, GraphNode, GraphEdge } from '$lib/types/graph';
import { config } from 'dotenv';

config();

type QueryType =
	| 'FIND_NODE'
	| 'NODE_PROPERTY'
	| 'DIRECT_CONNECTION'
	| 'NEIGHBORS'
	| 'MULTIHOP_PATH'
	| 'LIST_CATEGORY'
	| 'STATISTIC';

const graph = new Neo4jGraph({
	url: PUBLIC_NEO4J_URL,
	username: PUBLIC_NEO4J_USERNAME,
	password: PUBLIC_NEO4J_PASSWORD
});

const llm = new ChatOpenAI({
	modelName: 'gpt-4',
	temperature: 0,
	openAIApiKey: process.env.OPENAI_API_KEY
});

async function classifyQuery(userQuery: string): Promise<QueryType> {
	const classificationPrompt = `
        You are a natural language understanding expert.

        Classify the following question into one of the following types:
        - FIND_NODE: The user is looking for a specific node/entity by name or property.
        - NODE_PROPERTY: The user is asking about a property of a specific node.
        - DIRECT_CONNECTION: The user is asking how two entities are directly connected.
        - NEIGHBORS: The user is asking who or what is connected to a given entity.
        - MULTIHOP_PATH: The user is asking about indirect connections or paths with more than one hop.
        - LIST_CATEGORY: The user is asking to list all nodes of a certain type or label.
        - STATISTIC: The user is asking for a count, average, or other statistical information.

        Examples:
        "Find Alice" → FIND_NODE
        "How old is Bob?" → NODE_PROPERTY
        "Is Alice friends with Bob?" → DIRECT_CONNECTION
        "Who does Alice know?" → NEIGHBORS
        "Who are Alice's friends of friends?" → MULTIHOP_PATH
        "List all people in this world" → LIST_CATEGORY
        "How many cities are there?" → STATISTIC

        Now classify this question:
        "${userQuery}"
    `.trim();

	const classificationResponse = await llm.generate([
		[new HumanMessage({ content: classificationPrompt })]
	]);

	const type = classificationResponse.generations[0][0].text.trim().toUpperCase();
	return type as QueryType;
}

export async function handleQuery(userQuery: string, worldId: string) {
	const schema = graph.getSchema();
	console.log(schema);

	const queryType = await classifyQuery(userQuery);
	console.log('Query type:', queryType);

	const cypherPrompt = `
	You are a Cypher expert working with a Neo4j graph.

	GRAPH SCHEMA:
	${schema}

	Each graph is scoped to a specific world using a 'World' node.

	ALWAYS begin your Cypher query with this scoping pattern:

	MATCH (w:World) WHERE elementId(w) = "${worldId}"
	CALL apoc.path.subgraphAll(w, {}) YIELD nodes, relationships
	WITH nodes, relationships

	QUERY RULES:
	- Only return nodes relevant to the user's question.
	- If returning relationships, they MUST be returned as explicit objects with the following structure:
	{
		id: id(r),
		type: type(r),
		source: id(startNode(r)),
		target: id(endNode(r)),
		properties: properties(r)
	}
	- Do not return raw Neo4j relationship objects.
	- Expand the node set to include directly connected nodes via those relationships.
	- Use 'apoc.coll.toSet(...)'' to deduplicate nodes.
	- Use 'COLLECT(...)' for relationships and RETURN only once.
	- Never return the entire graph unless explicitly asked.

	RETURN FORMAT:
	RETURN nodes, relationships

	Where:
	- 'nodes' is a list of Neo4j native node objects (NOT plain objects).
	- 'relationships' is a list of maps as described above.

	QUERY TYPES:
	- FIND_NODE: Return the node(s) matching a name or property, and also return all directly connected nodes and relationships. Do NOT return only the queried node.
	- NODE_PROPERTY: Return the node and any meaningful connections that help interpret the property.
	- DIRECT_CONNECTION: Return two nodes and their direct relationship.
	- NEIGHBORS: Return a node, its immediate neighbors, and their connecting relationships.
	- MULTIHOP_PATH: Return a multistep path between two nodes.
	- LIST_CATEGORY: Return all nodes of a given label.
	- STATISTIC: Return a count or metric. Relationships may be omitted.

	USER QUESTION: "${userQuery}"
	QUERY TYPE: ${queryType}

	QUERY TEMPLATES:
	**FIND_NODE**:
	MATCH (w:World) WHERE elementId(w) = "${worldId}"
	CALL apoc.path.subgraphAll(w, {}) YIELD nodes, relationships
	WITH nodes, relationships

	UNWIND nodes AS n
	WITH n, relationships
	WHERE n.name = "<NODE_NAME>"

	WITH COLLECT(n) AS queriedNodes, relationships
	UNWIND queriedNodes AS qn
	MATCH (qn)-[r]-(connectedNode)

	WITH queriedNodes,
		COLLECT(DISTINCT connectedNode) AS neighbors,
		COLLECT(DISTINCT {
			id: id(r),
			type: type(r),
			source: id(startNode(r)),
			target: id(endNode(r)),
			properties: properties(r)
		}) AS relationships

	WITH apoc.coll.toSet(queriedNodes + neighbors) AS nodes, relationships
	RETURN nodes, relationships

	Cypher Output:
	A single valid Cypher query using the above rules.
	DO NOT include any comments, explanation, or extra output — ONLY the Cypher query.
    `.trim();

	function extractMessageContent(content: unknown): string {
		if (typeof content === 'string') {
			return content.trim();
		}

		if (Array.isArray(content)) {
			return content
				.map((part) => part.text ?? '')
				.join(' ')
				.trim();
		}

		return '';
	}

	const cypherResponse = await llm.invoke([new HumanMessage(cypherPrompt)]);
	const cypher = extractMessageContent(cypherResponse.content);
	console.log(cypher);
	const rawResult = await graph.query(cypher);
	console.dir(rawResult[0], { depth: null });

	const nodes = new Map<string, GraphNode>();
	const edges: GraphEdge[] = [];

	const resultNodes = rawResult[0].nodes ?? [];
	const resultRelationships = rawResult[0].relationships ?? [];

	for (const node of resultNodes) {
		const id = node.identity?.toString?.() ?? node.id?.toString?.();
		const name = node.name ?? 'Anon';
		const type = node.labels?.[0] ?? 'Unknown';

		nodes.set(id, {
			data: {
				id,
				name,
				type,
				label: name,
				...node.properties
			}
		});
	}

	for (const rel of resultRelationships) {
		const id = rel.id?.toString?.() ?? rel.identity?.toString?.();
		const source = rel.source?.toString?.() ?? rel.start?.toString?.();
		const target = rel.target?.toString?.() ?? rel.end?.toString?.();
		const label = rel.type;

		edges.push({
			data: {
				id,
				source,
				target,
				label,
				...(rel.properties ?? {})
			}
		});
	}

	console.log('now here');

	const graphData: GraphData = {
		nodes: Array.from(nodes.values()),
		edges
	};

	console.log(JSON.stringify(graphData, null, 2));

	if (graphData.nodes.length === 0) {
		throw new Error('No relevant data found for this query.');
	}

	const explanationPrompt = `
        The user asked: "${userQuery}"
        Query type: ${queryType}

        The following graph data was returned:
        ${JSON.stringify(rawResult, null, 2)}

        Answer the user's question clearly and concisely based on the data. 
    `.trim();

	const explanationResponse = await llm.generate([
		[new HumanMessage({ content: explanationPrompt })]
	]);

	console.log(explanationResponse.generations[0][0].text.trim());

	return {
		explanation: explanationResponse.generations[0][0].text.trim(),
		graphData: graphData
	};
}
