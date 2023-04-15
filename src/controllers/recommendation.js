'use strict'

const { frpQueries } = require('@database/graph/recommendation/frp')
const { contentFilteringQueries } = require('@database/graph/recommendation/contentFiltering')
const { neo4jMigrations } = require('@database/graph/recommendation/migration')

const getRecommendations = async (req, res) => {
	try {
		console.log(req.body.userId)
		const userId = req.body.userId
		const result = await frpQueries.findSimilarUsers(userId)

		const similarUsers = result.records.map((similarity) => {
			if (similarity._fields[0] !== userId) return similarity._fields[0]
			else return similarity._fields[1]
		})
		const uniqueSimilarUsers = Array.from(new Set(similarUsers))
		console.log(uniqueSimilarUsers)

		let recommendationItems = []
		for (let similarUser of uniqueSimilarUsers) {
			console.log(similarUser)
			const results = await frpQueries.recommendItems(similarUser, userId)
			//console.log(JSON.stringify(results.records, null, 4))
			//console.log(results.records)
			const items = results.records.map((record) => {
				return {
					itemId: record._fields[0],
					title: record._fields[1],
				}
			})
			recommendationItems = recommendationItems.concat(items)
		}

		const uniqueRecommendationItems = recommendationItems.filter(
			(obj, index, self) => index === self.findIndex((o) => o.itemId === obj.itemId && o.title === obj.title)
		)

		res.status(200).json({
			status: true,
			message: `Recommendations For User: ${userId} Retrieved`,
			data: uniqueRecommendationItems,
		})
	} catch (err) {
		console.log(err)
	}
}

const triggerProjectionAndKNN = async (req, res) => {
	try {
		//await frpQueries.setRatingToInteger()
		await frpQueries.deleteProjection()
		await frpQueries.deleteDeleteSIMILARRelationships()
		await frpQueries.generateProjection()
		await frpQueries.runFRP()
		await frpQueries.runKNN()
		res.status(200).json({
			status: true,
			message: 'Projection, FRP & KNN Run Successfully',
			data: {},
		})
	} catch (err) {
		console.log(err)
	}
}

const setUniqueConstraints = async (req, res) => {
	try {
		await neo4jMigrations.setCategoryIdAsUnique()
		await neo4jMigrations.setItemIdAsUnique()
		await neo4jMigrations.setMentorIdAsUnique()
		await neo4jMigrations.setProviderIdAsUnique()
		await neo4jMigrations.setUserIdAsUnique()
		res.status(200).json({
			status: true,
			message: 'Projection, FRP & KNN Run Successfully',
			data: {},
		})
	} catch (err) {
		console.log(err)
	}
}

const recomputeContentSimilarity = async (req, res) => {
	try {
		await contentFilteringQueries.deleteProjection()
		await contentFilteringQueries.deleteContentSimilarRelationships()
		await contentFilteringQueries.generateProjection()
		await contentFilteringQueries.runNodeSimilarity()
		res.status(200).json({
			status: true,
			message: 'Content Similarity Recomputed Successfully',
			data: {},
		})
	} catch (err) {
		console.log(err)
	}
}

exports.recommendationController = {
	getRecommendations,
	triggerProjectionAndKNN,
	setUniqueConstraints,
	recomputeContentSimilarity,
}
