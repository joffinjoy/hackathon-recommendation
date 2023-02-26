'use strict'

const { recommendationQueries } = require('@database/graph/recommendation/queries')

const addItem = async ({ item, categories, mentor, provider }) => {
	try {
		const itemNode = await recommendationQueries.addItem(item)
		const mentorNode = await recommendationQueries.addMentor(mentor)
		const providerNode = await recommendationQueries.addProvider(provider)
		const categoryNodes = await Promise.all(
			categories.map(async (category) => {
				return await recommendationQueries.addCategory(category)
			})
		)
		/* console.log('ITEM NODE: ', itemNode)
		console.log('MENTOR NODE: ', mentorNode)
		console.log('PROVIDER NODE: ', providerNode)
		console.log('CATEGORY NODES: ', categoryNodes) */
		const itemId = itemNode.properties.itemId
		const providerId = providerNode.properties.providerId
		const mentorId = mentorNode.properties.mentorId
		await recommendationQueries.connectItemProviderMentor(itemId, providerId, mentorId)
		await Promise.all(
			categoryNodes.map(async (categoryNode) => {
				await recommendationQueries.connectItemCategory(itemId, categoryNode.properties.categoryId)
			})
		)
		return true
	} catch (err) {
		console.log(err)
		throw err
	}
}

exports.itemService = { addItem }
