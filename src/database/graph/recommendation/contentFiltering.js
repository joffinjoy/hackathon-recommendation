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
		const result = await session.run(
			`
            CALL gds.nodeSimilarity.write('contentGraph', {
                nodeLabels:['Item','Category','Topic'],
                writeRelationshipType: 'CONTENT_SIMILAR',
                writeProperty: 'score',
                similarityCutoff: 0.5
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

exports.contentFilteringQueries = {
	generateProjection,
	runNodeSimilarity,
	deleteProjection,
	deleteContentSimilarRelationships,
}
