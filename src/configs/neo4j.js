'use strict'

const neo4j = require('neo4j-driver')

exports.neo4jDriver = neo4j.driver(process.env.NEO4J_URL)

/* const initialize = async () => {
	const session = driver.session()
	try {
		console.log('HELLO')
		const result = await session.run('MATCH (n) RETURN count(n) AS nodeCount')
		console.log(result.records[0].get('nodeCount'))
	} catch (err) {
		console.log(err)
		await session.close()
	}
}
 */
/* exports.neo4j = driver */
/* initialize() */
