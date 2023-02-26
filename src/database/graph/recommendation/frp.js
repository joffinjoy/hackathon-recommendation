'use strict'
const { neo4jDriver } = require('@configs/neo4j')

const generateProjection = async () => {
	const session = neo4jDriver.session()
	try {
		const result = await session.run(
			`CALL gds.graph.project(
                'ratings',
                ['User','Item'],
                {
                  RATED: {
                    orientation: 'UNDIRECTED',
                    properties: 'rating'
                  }
                }
              )`
		)
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
			`CALL gds.fastRP.mutate('ratings',
            {
              embeddingDimension: 16,
              randomSeed: 42,
              mutateProperty: 'embedding',
              relationshipWeightProperty: 'rating',
              iterationWeights: [0.8, 1, 1, 1]
            }
          )
          YIELD nodePropertiesWritten`
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
			`CALL gds.knn.write('ratings', {
                topK: 9,
                nodeProperties: ['embedding'],
                randomSeed: 42,
                concurrency: 1,
                sampleRate: 1.0,
                deltaThreshold: 0.0,
                writeRelationshipType: "SIMILAR",
                writeProperty: "score"
            })
            YIELD nodesCompared, relationshipsWritten, similarityDistribution
            RETURN nodesCompared, relationshipsWritten, similarityDistribution.mean as meanSimilarity`
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
		return result
	} catch (err) {
		console.log(err)
	} finally {
		session.close()
	}
}

/* const recommendItems = async (similarUserId, userId) => {
	const session = neo4jDriver.session()
	try {
		const result = await session.run(
			'MATCH (:User {userId: $similarUserId})-->(p1:Item) WITH collect(p1) as items MATCH (:User {userId: $userId})-->(p2:Item) WHERE not p2 in items RETURN p2.itemId as itemId, p2.title as title',
			{
				similarUserId,
				userId,
			}
		)
		return result
	} catch (err) {
		console.log(err)
	} finally {
		session.close()
	}
} */

const recommendItems = async (similarUserId, userId) => {
	const session = neo4jDriver.session()
	try {
		const result = await session.run(
			`MATCH (:User {userId: $userId})-->(p1:Item)
            WITH collect(p1) as items
            MATCH (:User {userId: $similarUserId})-->(p2:Item)
            WHERE not p2 in items
            RETURN p2.itemId as itemId, p2.title as title`,
			{
				similarUserId,
				userId,
			}
		)
		return result
	} catch (err) {
		console.log(err)
	} finally {
		session.close()
	}
}

const deleteProjection = async () => {
	const session = neo4jDriver.session()
	try {
		const result = await session.run("CALL gds.graph.drop('ratings')")
		console.log(JSON.stringify(result, null, 4))
		return true
	} catch (err) {
		console.log(err)
	} finally {
		session.close()
	}
}

const setRatingToInteger = async () => {
	const session = neo4jDriver.session()
	try {
		const result = await session.run(`MATCH ()-[r:RATED]->()
        SET r.rating = toInteger(r.rating)`)
		console.log(JSON.stringify(result, null, 4))
		return true
	} catch (err) {
		console.log(err)
	} finally {
		session.close()
	}
}

const deleteDeleteSIMILARRelationships = async () => {
	const session = neo4jDriver.session()
	try {
		const result = await session.run('match ()-[n:SIMILAR]-() delete n')
		console.log(JSON.stringify(result, null, 4))
		return true
	} catch (err) {
		console.log(err)
	} finally {
		session.close()
	}
}

exports.frpQueries = {
	generateProjection,
	runFRP,
	runKNN,
	findSimilarUsers,
	recommendItems,
	deleteProjection,
	deleteDeleteSIMILARRelationships,
	setRatingToInteger,
}
