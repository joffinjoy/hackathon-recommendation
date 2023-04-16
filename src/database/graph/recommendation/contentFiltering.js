'use strict'
const { neo4jDriver } = require('@configs/neo4j')

const deleteContentSimilarRelationships = async () => {
	const session = neo4jDriver.session()
	try {
		const result = await session.run(
			`
            MATCH ()-[r:CONTENT_SIMILAR]-()
            DELETE r
            `
		)
		console.log(JSON.stringify(result, null, 4))
		return true
	} catch (err) {
		console.log(err)
	} finally {
		session.close()
	}
}

const deleteProjection = async () => {
	const session = neo4jDriver.session()
	try {
		const result = await session.run("CALL gds.graph.drop('contentGraph')")
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
		const result = await session.run(
			`
            CALL gds.graph.project(
                'contentGraph',
                ['Item','Category','Subcategory','Topic','Mentor'],
                ['BELONGS_TO','RELATED_TO','IS_ABOUT','CONDUCTED_BY']
            )
            YIELD
                graphName AS graph, nodeProjection, nodeCount AS nodes, relationshipCount AS rels
            `
		)
		console.log(JSON.stringify(result, null, 4))
		return true
	} catch (err) {
		console.log(err)
	} finally {
		session.close()
	}
}

const runNodeSimilarity = async () => {
	const session = neo4jDriver.session()
	try {
		//similarityCutoff: 0.5
		const result = await session.run(
			`
            CALL gds.nodeSimilarity.write('contentGraph', {
                nodeLabels:['Item','Topic'],
                writeRelationshipType: 'CONTENT_SIMILAR',
                writeProperty: 'score',
                similarityCutoff: 0.4
            })
            YIELD nodesCompared, relationshipsWritten
            `
		)
		console.log(JSON.stringify(result, null, 4))
		return true
	} catch (err) {
		console.log(err)
	} finally {
		session.close()
	}
}

const getSimilarItems = async (itemId) => {
	const session = neo4jDriver.session()
	try {
		const result = await session.run(
			`
            MATCH (i:Item {itemId: $itemId})-[r:CONTENT_SIMILAR]-(q:Item)
            WHERE r.score >= 0.5
            RETURN i as selectedItem, q.itemId as itemId, q.title as title
            LIMIT 10
            `,
			{
				itemId,
			}
		)
		const recommendedItems = result.records.map((record) => {
			return { itemId: record.get('itemId'), title: record.get('title') }
		})
		//const selectedItem = result.records[0].get('i')
		return recommendedItems
	} catch (err) {
		console.log(err)
	} finally {
		session.close()
	}
}

const getProfilePageItems = async (userId) => {
	const session = neo4jDriver.session()
	try {
		const result = await session.run(
			`
            MATCH (u:User {userId: $userId})-[r:RATED]->(i:Item)
            WITH i, COLLECT(i) as ratedItems, (r.rating - 1) / 4.0 as normalizedRating
            ORDER BY normalizedRating DESC
            LIMIT 5

            MATCH (i)-[rel:CONTENT_SIMILAR]-(q:Item)
            WHERE NOT q IN ratedItems
            WITH q, rel.score + 1.5*normalizedRating as simScore
            ORDER BY simScore DESC
            WITH DISTINCT q, simScore
            LIMIT 10
            RETURN q.itemId as itemId, q.title as title, simScore as score
            `,
			{
				userId,
			}
		)
		const recommendedItems = result.records.map((record) => {
			return { itemId: record.get('itemId'), title: record.get('title'), score: record.get('score') }
		})
		//const selectedItem = result.records[0].get('i')
		return recommendedItems
	} catch (err) {
		console.log(err)
	} finally {
		session.close()
	}
}

exports.contentFilteringQueries = {
	generateProjection,
	runNodeSimilarity,
	deleteProjection,
	deleteContentSimilarRelationships,
	getSimilarItems,
	getProfilePageItems,
}
