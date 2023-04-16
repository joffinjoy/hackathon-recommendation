'use strict'
const { neo4jDriver } = require('@configs/neo4j')

const deleteProjection = async () => {
	const session = neo4jDriver.session()
	try {
		const result = await session.run("CALL gds.graph.drop('pageRankGraph')")
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
                    'pageRankGraph',
                    ['Item','Topic','User'],
                    {
                        RATED:{
                            properties: 'rating'
                        },
                        IS_ABOUT:{}
                    }
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

const runPageRank = async () => {
	const session = neo4jDriver.session()
	try {
		const result = await session.run(
			`CALL gds.pageRank.write('pageRankGraph', {
                maxIterations: 20,
                dampingFactor: 0.85,
                writeProperty: 'pageRank',
                nodeLabels:['Item','Topic','User'],
                relationshipTypes:['RATED','IS_ABOUT']
              })
              YIELD nodePropertiesWritten, ranIterations
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

const getImportantTopics = async () => {
	const session = neo4jDriver.session()
	try {
		const result = await session.run(
			`
            MATCH (t:Topic)
            ORDERBY t.pageRank
            return t.topicName as topic, t.pageRank as pageRank
            LIMIT 50
            `
		)
		console.log(JSON.stringify(result, null, 4))
		return result
	} catch (err) {
		console.log(err)
	} finally {
		session.close()
	}
}

exports.pageRankQueries = {
	generateProjection,
	deleteProjection,
	runPageRank,
	getImportantTopics,
}
