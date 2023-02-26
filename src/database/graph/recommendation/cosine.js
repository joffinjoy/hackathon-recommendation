'use strict'
const { neo4jDriver } = require('@configs/neo4j')

const runCosineItems = async () => {
	const session = neo4jDriver.session()
	try {
		const result = await session.run(
			"CALL gds.alpha.similarity.cosine.write({ nodeProjection: 'Item', relationshipProjection: { RATED: { type: 'RATED', orientation: 'UNDIRECTED' } }, similarityCutoff: 0.1, writeRelationshipType: 'SIMILAR', writeProperty: 'score' })"
		)
		console.log(JSON.stringify(result, null, 4))
		return true
	} catch (err) {
		console.log(err)
	} finally {
		session.close()
	}
}

const runCosineUsers = async () => {
	const session = neo4jDriver.session()
	try {
		const result = await session.run(
			"CALL gds.alpha.similarity.cosine.write({ nodeProjection: 'User', relationshipProjection: { RATED: { type: 'RATED', orientation: 'UNDIRECTED' } }, similarityCutoff: 0.1, writeRelationshipType: 'SIMILAR', writeProperty: 'score' })"
		)
		console.log(JSON.stringify(result, null, 4))
		return true
	} catch (err) {
		console.log(err)
	} finally {
		session.close()
	}
}

/* const runKNN = async () => {
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
} */

const findRecommendations = async (userId) => {
	const session = neo4jDriver.session()
	try {
		const result = await session.run(
			'MATCH (u:User {id: $userId})-[:RATED]->(i:Item) WHERE NOT EXISTS((u)-[:SIMILAR]-(i)) WITH u, i MATCH (u)-[:SIMILAR]-(other)-[:RATED]->(i2:Item) WHERE NOT EXISTS((u)-[:RATED]->(i2)) WITH i2, SUM(other.score) AS score RETURN i2.id, score ORDER BY score DESC LIMIT 10',
			{ userId }
		)
		console.log(JSON.stringify(result, null, 4))
		result.records.forEach((record) => {
			console.log(record.get('i2.id'), record.get('score'))
		})
		return true
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
} */

exports.cosineQueries = {
	runCosineItems,
	runCosineUsers,
	findRecommendations,
}
