import neo4j from 'neo4j-driver';
import { PUBLIC_NEO4J_URL, PUBLIC_NEO4J_USERNAME, PUBLIC_NEO4J_PASSWORD } from '$env/static/public';

const neo4jConfig = {
	url: PUBLIC_NEO4J_URL,
	username: PUBLIC_NEO4J_USERNAME,
	password: PUBLIC_NEO4J_PASSWORD
};

const driver = neo4j.driver(
	neo4jConfig.url,
	neo4j.auth.basic(neo4jConfig.username, neo4jConfig.password)
);

export default driver;
