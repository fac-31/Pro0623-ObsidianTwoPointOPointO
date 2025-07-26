import os

from langchain.text_splitter import CharacterTextSplitter
from langchain_core.prompts.chat import ChatPromptTemplate
from langchain_openai import OpenAIEmbeddings
from langchain_neo4j import Neo4jGraph
from langchain_openai import ChatOpenAI
from langchain_experimental.graph_transformers import LLMGraphTransformer
from langchain_community.graphs.graph_document import Node, Relationship

from dotenv import load_dotenv
load_dotenv()

DOCS_PATH = "llm-knowledge-graph/data/course/pdfs"

llm = ChatOpenAI(
    openai_api_key=os.getenv('OPENAI_API_KEY'), # type: ignore
    model_name="gpt-3.5-turbo" # type: ignore
)

embedding_provider = OpenAIEmbeddings(
    openai_api_key=os.getenv('OPENAI_API_KEY'), # type: ignore
    model="text-embedding-ada-002"
    )

graph = Neo4jGraph(
    url=os.getenv('PUBLIC_NEO4J_URL'),
    username=os.getenv('PUBLIC_NEO4J_USERNAME'),
    password=os.getenv('PUBLIC_NEO4J_PASSWORD')
)

template = ChatPromptTemplate([
    ("system", "You are a Knowledge Graph Builder. Build relationships and nodes that accurately represent the chunk text provided. Where you can, give character nodes the properties: name, age. Dot not create nodes or relationships that are not represented in the chunk text provided")
])

doc_transformer = LLMGraphTransformer(
    llm=llm,
    allowed_nodes=['Character', 'Location', 'Event', 'Subject'],
    node_properties=['name', 'age', 'description']
    )

# split documents
text_splitter = CharacterTextSplitter(
    separator="\n\n",
    chunk_size=500,
    chunk_overlap=250,
    add_start_index=True
)

def build_world(world, userId):

    # Get Documents From Graph
    docs = graph.query(
        """
        MATCH (w: World) WHERE elementId(w) = $world
        MATCH (d: Document)-[:DESCRIBES]->(w) 
        RETURN d AS doc
        """,
        { "world": world }
    )

    # Convert Graph Nodes into langchain Documents
    def get_content(doc):
        return doc['doc']['content']

    def get_metadata(doc):
        doc['doc'].pop('content')
        return doc['doc']

    texts = list(map(get_content,docs))
    metadatas = list(map(get_metadata,docs))

    documents = text_splitter.create_documents(texts,metadatas)

    # Split Documents into Chunks
    chunks = text_splitter.split_documents(documents)

    # Embed chunks and create nodes
    for chunk in chunks:

        filename = chunk.metadata['id']
        chunk_id = f"{filename}.{chunk.metadata["start_index"]}"
        print("Processing -", chunk_id)

        # Embed the chunk
        chunk_embedding = embedding_provider.embed_query(chunk.page_content)

        # Add the Document and Chunk nodes to the graph
        properties = {
            "filename": filename,
            "chunk_id": chunk_id,
            "text": chunk.page_content,
            "embedding": chunk_embedding,
            "createdBy": userId
        }
        
        graph.query("""
            MATCH (d:Document {id: $filename})
            MERGE (c:Chunk {id: $chunk_id})
            SET c.text = $text, c.createdBy = $createdBy
            MERGE (d)<-[:PART_OF]-(c)
            WITH c
            CALL db.create.setNodeVectorProperty(c, 'textEmbedding', $embedding)
            """, 
            properties
        )

        # Generate the entities and relationships from the chunk
        graph_docs = doc_transformer.convert_to_graph_documents([chunk])

        # Map the entities in the graph documents to the chunk node
        for graph_doc in graph_docs:
            chunk_node = Node(
                id=chunk_id,
                type="Chunk"
            )

            for node in graph_doc.nodes:
                node.properties['createdBy'] = userId
                graph_doc.relationships.append(
                    Relationship(
                        source=chunk_node,
                        target=node, 
                        type="HAS_ENTITY"
                        )
                    )

        # add the graph documents to the graph
        graph.add_graph_documents(graph_docs) # type: ignore

if __name__ == "__main__":
    print("Building World")
    
    # Build World
    build_world("Billy's World", "user123")