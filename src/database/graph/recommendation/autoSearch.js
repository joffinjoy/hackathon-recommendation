'use strict'
const { neo4jDriver } = require('@configs/neo4j')
const neo4j = require('neo4j-driver')

const getImportantTopics = async (skipCount, limit) => {
	console.log('SKIPCOUNT: ', skipCount)
	console.log('LIMIT: ', limit)
	const session = neo4jDriver.session()
	try {
		const result = await session.run(
			`
            MATCH (t:Topic)
            WHERE t.pageRank IS NOT NULL
            return t.topicName as topic, t.pageRank as pageRank
            ORDER BY t.pageRank DESC
            SKIP $skipCount
            LIMIT $limit
            `,
			{
				skipCount: neo4j.int(skipCount),
				limit: neo4j.int(limit),
			}
		)
		//console.log(JSON.stringify(result, null, 4))
		return result
	} catch (err) {
		console.log('HELLO: ', err)
	} finally {
		session.close()
	}
}

exports.autoSearchQueries = {
	getImportantTopics,
}
