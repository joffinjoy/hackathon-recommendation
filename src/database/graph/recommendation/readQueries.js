'use strict'
const { neo4jDriver } = require('@configs/neo4j')

const getEmailIds = async (itemId, userId, rating) => {
	const session = neo4jDriver.session()
	try {
		const result = await session.run('match (n:User) return n.email', {
			itemId,
			userId,
			rating,
		})
		console.log(result)
		return result
	} catch (err) {
		console.log('ReadQueries.getEmailIds: ', err)
		throw err
	} finally {
		session.close()
	}
}

exports.readQueries = {
	getEmailIds,
}
