'use strict'

const { neo4jDriver } = require('@configs/neo4j')

const setUserIdAsUnique = async () => {
	const session = neo4jDriver.session()
	try {
		const query = 'CREATE CONSTRAINT FOR (p:User) REQUIRE p.userId IS UNIQUE'
		await session.run(query)
	} catch (err) {
		console.log(err)
		session.close()
	}
}

const setItemIdAsUnique = async () => {
	const session = neo4jDriver.session()
	try {
		const query = 'CREATE CONSTRAINT FOR (p:Item) REQUIRE p.itemId IS UNIQUE'
		await session.run(query)
	} catch (err) {
		console.log(err)
		session.close()
	}
}

const setCategoryIdAsUnique = async () => {
	const session = neo4jDriver.session()
	try {
		const query = 'CREATE CONSTRAINT FOR (p:Category) REQUIRE p.categoryId IS UNIQUE'
		await session.run(query)
	} catch (err) {
		console.log(err)
		session.close()
	}
}

const setMentorIdAsUnique = async () => {
	const session = neo4jDriver.session()
	try {
		const query = 'CREATE CONSTRAINT FOR (p:Mentor) REQUIRE p.mentorId IS UNIQUE'
		await session.run(query)
	} catch (err) {
		console.log(err)
		session.close()
	}
}

const setProviderIdAsUnique = async () => {
	const session = neo4jDriver.session()
	try {
		const query = 'CREATE CONSTRAINT FOR (p:Provider) REQUIRE p.providerId IS UNIQUE'
		await session.run(query)
	} catch (err) {
		console.log(err)
		session.close()
	}
}

const deleteAllNodes = async () => {
	const session = neo4jDriver.session()
	try {
		const query = 'MATCH (n) DETACH DELETE n'
		await session.run(query)
	} catch (err) {
		console.log(err)
		session.close()
	}
}
exports.neo4jMigrations = {
	setProviderIdAsUnique,
	setMentorIdAsUnique,
	setCategoryIdAsUnique,
	setItemIdAsUnique,
	setUserIdAsUnique,
	deleteAllNodes,
}
