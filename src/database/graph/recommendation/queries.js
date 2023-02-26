'use strict'
const { neo4jDriver } = require('@configs/neo4j')

const addUser = async (user) => {
	const session = neo4jDriver.session()
	try {
		const result = await session.run(
			'MERGE (n:User {userId: $userId}) SET n.name = $name, n.email = $email, n.phone = $phone RETURN n',
			{
				name: user.name,
				email: user.email,
				phone: user.phone,
				userId: user.userId,
			}
		)
		console.log(result.records[0].get('n'))
		return result.records[0].get('n')
	} catch (err) {
		console.log(err)
		return false
	} finally {
		session.close()
	}
}

const addItem = async (item) => {
	const session = neo4jDriver.session()
	try {
		const result = await session.run('MERGE (n:Item {itemId: $itemId}) SET n.title = $title RETURN n', {
			itemId: item.id,
			title: item.title,
		})
		console.log(result.records[0].get('n'))
		return result.records[0].get('n')
	} catch (err) {
		console.log(err)
		return false
	} finally {
		session.close()
	}
}

const addCategory = async (category) => {
	const session = neo4jDriver.session()
	try {
		const result = await session.run(
			'MERGE (n:Category {categoryId: $categoryId}) SET n.name = $categoryName RETURN n',
			{
				categoryId: category.id,
				categoryName: category.name,
			}
		)
		console.log(result.records[0].get('n'))
		return result.records[0].get('n')
	} catch (err) {
		console.log(err)
		return false
	} finally {
		session.close()
	}
}

const addMentor = async (mentor) => {
	const session = neo4jDriver.session()
	try {
		const result = await session.run('MERGE (n:Mentor {mentorId: $mentorId}) SET n.name = $mentorName RETURN n', {
			mentorId: mentor.id,
			mentorName: mentor.name,
		})
		console.log(result.records[0].get('n'))
		return result.records[0].get('n')
	} catch (err) {
		console.log(err)
		return false
	} finally {
		session.close()
	}
}

const addProvider = async (provider) => {
	const session = neo4jDriver.session()
	try {
		const result = await session.run(
			'MERGE (n:Provider {providerId: $providerId}) SET n.name = $providerName RETURN n',
			{
				providerId: provider.id,
				providerName: provider.name,
			}
		)
		console.log(result.records[0].get('n'))
		return result.records[0].get('n')
	} catch (err) {
		console.log(err)
		return false
	} finally {
		session.close()
	}
}

const connectItemProviderMentor = async (itemId, providerId, mentorId) => {
	const session = neo4jDriver.session()
	try {
		await session.run(
			'MATCH (i:Item {itemId: $itemId}), (p:Provider {providerId: $providerId}), (m:Mentor {mentorId: $mentorId}) MERGE (i)-[:CONDUCTED_BY]->(m) MERGE (m)-[:MEMBER_OF]->(p)',
			{
				itemId,
				providerId,
				mentorId,
			}
		)
		return true
	} catch (err) {
		console.log(err)
		return false
	} finally {
		session.close()
	}
}

const connectItemCategory = async (itemId, categoryId) => {
	const session = neo4jDriver.session()
	try {
		await session.run(
			'MATCH (i:Item {itemId: $itemId}), (c:Category {categoryId: $categoryId}) MERGE(i)-[:BELONGS_TO]->(c)',
			{
				itemId,
				categoryId,
			}
		)
		return true
	} catch (err) {
		console.log(err)
		return false
	} finally {
		session.close()
	}
}

const addRating = async (itemId, userId, rating) => {
	const session = neo4jDriver.session()
	try {
		const result = await session.run(
			'MATCH (i:Item {itemId: $itemId}), (u:User {userId: $userId}) MERGE (u)-[r:RATED]->(i) SET r.rating = $rating RETURN r',
			{
				itemId,
				userId,
				rating,
			}
		)
		console.log(result)
		return true
	} catch (err) {
		console.log(err)
		return false
	} finally {
		session.close()
	}
}
//match (n:User) return n.email

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
		console.log(err)
		return false
	} finally {
		session.close()
	}
}

exports.recommendationQueries = {
	addUser,
	addItem,
	addCategory,
	addProvider,
	addMentor,
	connectItemProviderMentor,
	connectItemCategory,
	addRating,
	getEmailIds,
}
