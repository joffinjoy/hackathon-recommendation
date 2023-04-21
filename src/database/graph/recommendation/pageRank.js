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

/* properties:{
    rating:{
        defaultValue: 1
    }
} */
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
                        IS_ABOUT:{
                            properties:{
                                rating:{
                                    defaultValue: 1
                                }
                            }
                        }
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
//relationshipWeightProperty:'rating'
const runPageRank = async () => {
	const session = neo4jDriver.session()
	try {
		const result = await session.run(
			`CALL gds.pageRank.write('pageRankGraph', {
                maxIterations: 20,
                dampingFactor: 0.85,
                writeProperty: 'pageRank',
                nodeLabels:['Item','Topic','User'],
                relationshipTypes:['RATED','IS_ABOUT'],
                relationshipWeightProperty:'rating'
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

exports.pageRankQueries = {
	generateProjection,
	deleteProjection,
	runPageRank,
}
