// Import World nodes
LOAD CSV WITH HEADERS FROM 'file:///nodes.csv' AS nodeRow
WITH nodeRow WHERE nodeRow.`:LABEL` = 'World'
CREATE (w:World {
  nodeId: nodeRow.nodeId,
  name: nodeRow.name,
  description: nodeRow.description,
  userId: nodeRow.userId,
  createdAt: nodeRow.createdAt
});

// Import Location nodes
LOAD CSV WITH HEADERS FROM 'file:///nodes.csv' AS nodeRow
WITH nodeRow WHERE nodeRow.`:LABEL` = 'Location'
CREATE (l:Location {
  nodeId: nodeRow.nodeId,
  name: nodeRow.name,
  description: nodeRow.description,
  userId: nodeRow.userId,
  createdAt: nodeRow.createdAt
});

// Import Character nodes
LOAD CSV WITH HEADERS FROM 'file:///nodes.csv' AS nodeRow
WITH nodeRow WHERE nodeRow.`:LABEL` = 'Character'
CREATE (c:Character {
  nodeId: nodeRow.nodeId,
  name: nodeRow.name,
  description: nodeRow.description,
  userId: nodeRow.userId,
  createdAt: nodeRow.createdAt
});

// Import Event nodes
LOAD CSV WITH HEADERS FROM 'file:///nodes.csv' AS nodeRow
WITH nodeRow WHERE nodeRow.`:LABEL` = 'Event'
CREATE (e:Event {
  nodeId: nodeRow.nodeId,
  name: nodeRow.name,
  description: nodeRow.description,
  userId: nodeRow.userId,
  createdAt: nodeRow.createdAt
});

// Import CONTAINS relationships
LOAD CSV WITH HEADERS FROM 'file:///relationships.csv' AS relRow
WITH relRow WHERE relRow.`:TYPE` = 'CONTAINS'
MATCH (start {nodeId: relRow.`:START_ID`})
MATCH (end {nodeId: relRow.`:END_ID`})
CREATE (start)-[:CONTAINS {description: relRow.description}]->(end);

// Import family relationships
LOAD CSV WITH HEADERS FROM 'file:///relationships.csv' AS relRow
WITH relRow WHERE relRow.`:TYPE` IN ['MOTHER_OF', 'SON_OF', 'FATHER_OF', 'DAUGHTER_OF', 'GRANDMOTHER_OF', 'GRANDDAUGHTER_OF', 'CREATOR_OF', 'CREATED_BY', 'SIBLING_OF', 'PARENT_OF', 'OFFSPRING_OF', 'GRANDPARENT_OF', 'GRANDCHILD_OF']
MATCH (start {nodeId: relRow.`:START_ID`})
MATCH (end {nodeId: relRow.`:END_ID`})
CREATE (start)-[:RELATED_TO {type: relRow.`:TYPE`, description: relRow.description}]->(end);

// Import event-location relationships
LOAD CSV WITH HEADERS FROM 'file:///relationships.csv' AS relRow
WITH relRow WHERE relRow.`:TYPE` = 'HAPPENED_AT'
MATCH (start {nodeId: relRow.`:START_ID`})
MATCH (end {nodeId: relRow.`:END_ID`})
CREATE (start)-[:HAPPENED_AT {description: relRow.description}]->(end);

// Import character-event relationships
LOAD CSV WITH HEADERS FROM 'file:///relationships.csv' AS relRow
WITH relRow WHERE relRow.`:TYPE` = 'PRESENT_AT'
MATCH (start {nodeId: relRow.`:START_ID`})
MATCH (end {nodeId: relRow.`:END_ID`})
CREATE (start)-[:PRESENT_AT {description: relRow.description}]->(end);

// Import temporal relationships
LOAD CSV WITH HEADERS FROM 'file:///relationships.csv' AS relRow
WITH relRow WHERE relRow.`:TYPE` IN ['HAPPENED_BEFORE', 'HAPPENED_AFTER']
MATCH (start {nodeId: relRow.`:START_ID`})
MATCH (end {nodeId: relRow.`:END_ID`})
CREATE (start)-[:TEMPORAL {type: relRow.`:TYPE`, description: relRow.description}]->(end);