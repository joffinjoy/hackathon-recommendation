'use strict'

const { recommendationQueries } = require('@database/graph/recommendation/queries')
const { nounTokenizer } = require('@utils/tokenizer')

const addItem = async ({ item, categories, mentor, provider }) => {
	try {
		const itemNode = await recommendationQueries.addItem(item)
		const mentorNode = await recommendationQueries.addMentor(mentor)
		const providerNode = await recommendationQueries.addProvider(provider)

		const categoryNodesArray = await Promise.all(
			categories.map(async (category) => {
				const categoryNodes = await Promise.all(
					category.name.split(' ').map(async (category) => {
						console.log('CATEGORY: ', category)
						return await recommendationQueries.addCategory({
							id: category.toLowerCase(),
							name: category,
						})
					})
				)
				const subcategoryNode = await recommendationQueries.addSubcategory(category)
				return {
					categoryNodes,
					subcategoryNode,
				}
			})
		)
		console.log('CATEGORY NODES:', categoryNodesArray)
		console.log(typeof categoryNodesArray)

		const itemId = itemNode.properties.itemId
		const providerId = providerNode.properties.providerId
		const mentorId = mentorNode.properties.mentorId
		await recommendationQueries.connectItemProviderMentor(itemId, providerId, mentorId)
		await Promise.all(
			categoryNodesArray.map(async (categoryObject) => {
				recommendationQueries.createBelongsToEdge(
					itemId,
					categoryObject.subcategoryNode.properties.subcategoryId
				)
				categoryObject.categoryNodes.map((category) => {
					recommendationQueries.createRelatedToEdge(itemId, category.properties.categoryId)
					recommendationQueries.createSubcategoryOfEdge(
						categoryObject.subcategoryNode.properties.subcategoryId,
						category.properties.categoryId
					)
				})
			})
		)

		const relevantTokens = nounTokenizer(item.title)
		relevantTokens.map((token) => {
			if (!token.includes('ClusterNumber')) recommendationQueries.createIsAboutEdge(itemId, token)
		})
		return true
	} catch (err) {
		console.log(err)
		throw err
	}
}

exports.itemService = { addItem }
