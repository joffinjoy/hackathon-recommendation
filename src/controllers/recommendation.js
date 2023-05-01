'use strict'

const { collaborativeFilteringQueries } = require('@database/graph/recommendation/collaborativeFiltering')
const { contentFilteringQueries } = require('@database/graph/recommendation/contentFiltering')
const { pageRankQueries } = require('@database/graph/recommendation/pageRank')
const { autoSearchService } = require('@services/autoSearch')
const { nodeQueries } = require('@database/graph/nodeQueries')
const { recommendationService } = require('@services/recommendation')
const { failedRes } = require('@utils/failedRes')

const getCollaborativeRecommendations = async (req, res) => {
	try {
		const userId = req.body.userId
		const recommendedItems = await recommendationService.getCollaborativeRecommendations(userId)
		res.status(200).json({
			status: true,
			message: `Recommendations For User: ${userId} Retrieved`,
			data: recommendedItems,
		})
	} catch (err) {
		console.log(err)
		failedRes(res, 'Something Went Wrong')
	}
}

const recomputeCollaborativeSimilarity = async (req, res) => {
	try {
		await collaborativeFilteringQueries.deleteProjection()
		await collaborativeFilteringQueries.deleteCollabSimilarRelationships()
		await collaborativeFilteringQueries.generateProjection()
		await collaborativeFilteringQueries.runFRP()
		await collaborativeFilteringQueries.runKNN()
		res.status(200).json({
			status: true,
			message: 'Collaborative Filtering Recomputed Successfully',
		})
	} catch (err) {
		console.log(err)
		failedRes(res, 'Something Went Wrong')
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
		failedRes(res, 'Something Went Wrong')
	}
}

const getItemPageRecommendations = async (req, res) => {
	try {
		const itemId = req.body.itemId
		const similarItems = await contentFilteringQueries.getSimilarItems(itemId)
		res.status(200).json({
			status: true,
			message: 'Item Page Recommendations Fetched',
			data: similarItems,
		})
	} catch (err) {
		console.log(err)
		failedRes(res, 'Something Went Wrong')
	}
}

const getProfilePageRecommendations = async (req, res) => {
	try {
		const userId = req.body.userId
		const similarItems = await contentFilteringQueries.getProfilePageItems(userId)
		res.status(200).json({
			status: true,
			message: 'Item Page Recommendations Fetched',
			data: similarItems,
		})
	} catch (err) {
		console.log(err)
		failedRes(res, 'Something Went Wrong')
	}
}

const recomputePageRank = async (req, res) => {
	try {
		await pageRankQueries.deleteProjection()
		await pageRankQueries.generateProjection()
		await pageRankQueries.runPageRank()
		res.status(200).json({
			status: true,
			message: 'PageRank Computed Successfully',
			data: [],
		})
	} catch (err) {
		console.log(err)
		failedRes(res, 'Something Went Wrong')
	}
}

const triggerAutoSearch = async (req, res) => {
	try {
		const command = req.query.command
		await autoSearchService.triggerAutoSearch(command)
		res.status(200).json({
			status: true,
			message: 'AutoSearch Command Received Successfully',
			data: [],
		})
	} catch (err) {
		console.log(err)
		failedRes(res, 'Something Went Wrong')
	}
}

const deleteAllNodes = async (req, res) => {
	try {
		const result = await nodeQueries.deleteAllNodes()
		res.status(200).json({
			status: true,
			message: 'All Nodes Deleted',
			data: result,
		})
	} catch (err) {
		console.log(err)
		failedRes(res, 'Something Went Wrong')
	}
}

exports.recommendationController = {
	getCollaborativeRecommendations,
	recomputeCollaborativeSimilarity,
	recomputeContentSimilarity,
	getItemPageRecommendations,
	getProfilePageRecommendations,
	recomputePageRank,
	triggerAutoSearch,
	deleteAllNodes,
}
