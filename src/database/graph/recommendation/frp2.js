'use strict'
const { neo4jDriver } = require('@configs/neo4j')

const generateIndex = async () => {
	const session = neo4jDriver.session()
	try {
		const result = await session.run(
			'CREATE INDEX weight_rated_index IF NOT EXISTS FOR ()-[r:RATED]-() ON (r.weight)'
		)
		console.log(JSON.stringify(result, null, 4))
		return true
	} catch (err) {
		console.log(err)
	} finally {
		session.close()
	}
}

const generateProjection = async () => {
	const session = neo4jDriver.session()
	try {
		const query = `
  CALL gds.graph.project('embedding-projection', ['User', 'Item'], {
    RATED: {
      orientation: 'UNDIRECTED',
      properties: {
        weight: {
          defaultValue: 1.0
        }
      }
    }
  })
`
		const result = await session.run(query)
		console.log(JSON.stringify(result, null, 4))
		return true
	} catch (err) {
		console.log(err)
	} finally {
		session.close()
	}
}

const runFRP = async () => {
	const session = neo4jDriver.session()
	try {
		const result = await session.run(
			"CALL gds.fastRP.mutate('embedding-projection', { embeddingDimension: 256, randomSeed: 42, mutateProperty: 'embedding', relationshipWeightProperty: 'weight' } ) YIELD nodePropertiesWritten"
		)
		console.log(JSON.stringify(result, null, 4))
		return true
	} catch (err) {
		console.log(err)
	} finally {
		session.close()
	}
}

const runKNN = async () => {
	const session = neo4jDriver.session()
	try {
		const result = await session.run(
			"CALL gds.knn.write('ratings', { topK: 16, nodeProperties: ['embedding'], randomSeed: 42, concurrency: 1, sampleRate: 1.0, deltaThreshold: 0.0, writeRelationshipType: 'SIMILAR', writeProperty: 'score' }) YIELD nodesCompared, relationshipsWritten, similarityDistribution RETURN nodesCompared, relationshipsWritten, similarityDistribution.mean as meanSimilarity"
		)
		console.log(JSON.stringify(result, null, 4))
		return true
	} catch (err) {
		console.log(err)
	} finally {
		session.close()
	}
}

const findSimilarUsers = async (userId) => {
	const session = neo4jDriver.session()
	try {
		const result = await session.run(
			'MATCH (n:User{userId: $userId})-[r:SIMILAR]->(m:User) RETURN n.userId as User1, m.userId as User2, r.score as similarity ORDER BY similarity DESCENDING, User1, User2',
			{ userId }
		)
		console.log(JSON.stringify(result, null, 4))
		return true
	} catch (err) {
		console.log(err)
	} finally {
		session.close()
	}
}

const recommendItems = async (similarUserId, userId) => {
	const session = neo4jDriver.session()
	try {
		const result = await session.run(
			'MATCH (:User {userId: $similarUserId})-->(p1:Item) WITH collect(p1) as items MATCH (:User {userId: $userId})-->(p2:Item) WHERE not p2 in items RETURN p2.title as recommendation',
			{
				similarUserId,
				userId,
			}
		)
		console.log(JSON.stringify(result, null, 4))
		return true
	} catch (err) {
		console.log(err)
	} finally {
		session.close()
	}
}

exports.frp2Queries = {
	generateProjection,
	runFRP,
	runKNN,
	findSimilarUsers,
	recommendItems,
	generateIndex,
}
