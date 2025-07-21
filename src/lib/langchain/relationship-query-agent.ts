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

export async function handleQuery(userQuery: string, worldName: string) {
	const schema = graph.getSchema();
	console.log(schema);

	const queryType = await classifyQuery(userQuery);
	console.log('Query type:', queryType);

	const cypherPrompt = `
        You are a Cypher expert working with a Neo4j graph.

        GRAPH SCHEMA:
        ${schema}

        Each graph is scoped to a specific world by using a \`World\` node with a unique \`name\` property.

        You MUST ALWAYS begin your Cypher query with this world-scoping pattern:

        MATCH (w:World { name: "${worldName}" })
        CALL apoc.path.subgraphAll(w, {}) YIELD nodes, relationships
        WITH nodes, relationships

        IMPORTANT RULES:
        - Always scope your query to the specified world using the pattern above.
        - Only return nodes that are relevant to the user's question.
        - Only include relationships that are **meaningfully connected** to the returned nodes.
        - It is acceptable for \`relationships\` to be an **empty list** if the query doesn’t require them (e.g. FIND_NODE, NODE_PROPERTY, STATISTIC).
        - Never return the entire subgraph unless explicitly requested.

        The format of your return must always be:

        RETURN nodes, relationships

        To achieve this:
        - Use UNWIND on the collected \`nodes\` and \`relationships\` if you need to filter.
        - Filter relationships using a list comprehension like:
          \`[r IN relationships WHERE startNode(r) IN nodes AND endNode(r) IN nodes]\`
        - Then return:
          \`RETURN nodes, relationships\`

        DO NOT:
        - Return raw node or relationship variables like \`RETURN n\`, \`RETURN r\`, or \`RETURN p\`.
        - Return unfiltered or irrelevant parts of the graph.
        - Return relationships unless they are directly connected to the returned nodes.

        QUERY TYPES YOU MAY HANDLE:
        - **FIND_NODE**: Return a node by name or unique property. Include only directly connected nodes and relationships if relevant.
        - **NODE_PROPERTY**: Same as FIND_NODE. Relationships may be empty.
        - **DIRECT_CONNECTION**: Return two nodes and the relationship(s) directly connecting them.
        - **NEIGHBORS**: Return a node and all its immediate neighbors and the relationships connecting them.
        - **MULTIHOP_PATH**: Return a meaningful path or chain of connections (e.g. shortestPath) between nodes.
        - **LIST_CATEGORY**: Return all nodes of a certain label in the world (e.g. all Characters, all Places).
        - **STATISTIC**: Return nodes used to summarize a count or metric. Relationships can be empty.

        QUERY TYPE: ${queryType}

        USER'S QUESTION: "${userQuery}"

        OUTPUT:
        A single valid Cypher query that:
        - Returns at least one node.
        - Uses the correct scoping pattern.
        - Returns only meaningful nodes and relationships.
        - May return \`relationships\` as an empty list.
        - If you return an empty list for relationships, you MUST alias it: \`[] AS relationships\`.
        - NEVER write \`WITH ..., []\` without \`AS relationships\`; this will break the query.
        - Uses: \`RETURN nodes, relationships\`

        DO NOT add any comments or explanation — only return the Cypher query.
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
	console.log(rawResult);
	console.dir(rawResult[0], { depth: null });

	const nodes = new Map<string, GraphNode>();
	const edges: GraphEdge[] = [];

	const resultNodes = rawResult[0].nodes ?? [];
	const resultRelationships = rawResult[0].relationships ?? [];

	for (const node of resultNodes) {
		if (node?.identity && node?.labels) {
			// Neo4j Node instance
			nodes.set(node.identity.toString(), {
				data: {
					id: node.identity.toString(),
					label: node.labels?.[0] ?? 'Unknown',
					...node.properties
				}
			});
		} else if (node?.name || node?.id) {
			// Plain object node (likely from COLLECT(n))
			const id = node.id?.toString?.() ?? node.name ?? crypto.randomUUID();
			nodes.set(id, {
				data: {
					id,
					label: 'Unknown',
					...node
				}
			});
		} else {
			console.warn('Skipping unrecognized node structure:', node);
		}
	}

	for (const rel of resultRelationships) {
		// Case 1: Neo4j native Relationship object
		if (rel?.identity && rel?.start && rel?.end && rel?.type) {
			edges.push({
				data: {
					id: rel.identity.toString(),
					source: rel.start.toString(),
					target: rel.end.toString(),
					label: rel.type,
					...rel.properties
				}
			});
		}
		// Case 2: Already-unwrapped object (e.g. from a custom Cypher RETURN)
		else if ((rel?.id || rel?.source || rel?.target) && typeof rel?.type === 'string') {
			const id = rel.id?.toString?.() ?? crypto.randomUUID();
			const source = rel.source?.toString?.() ?? 'unknown';
			const target = rel.target?.toString?.() ?? 'unknown';

			edges.push({
				data: {
					id,
					source,
					target,
					label: rel.type,
					...rel
				}
			});
		} else {
			console.warn('Skipping unrecognized relationship structure:', rel);
		}
	}

	console.log('now here');

	const graphData: GraphData = {
		nodes: Array.from(nodes.values()),
		edges
	};

	console.log(graphData);

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
