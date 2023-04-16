'use strict'
const { neo4jDriver } = require('@configs/neo4j')

const getImportantTopics = async () => {
	const session = neo4jDriver.session()
	try {
		const result = await session.run(
			`
            MATCH (t:Topic)
            return t.topicName as topic, t.pageRank as pageRank
            ORDER BY t.pageRank DESC
            LIMIT 10
            `
		)
		//console.log(JSON.stringify(result, null, 4))
		return result
	} catch (err) {
		console.log(err)
	} finally {
		session.close()
	}
}

exports.autoSearchQueries = {
	getImportantTopics,
}
