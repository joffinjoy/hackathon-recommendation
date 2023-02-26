'use strict'
const { recommendationQueries } = require('@database/graph/recommendation/queries')

const addRating = async (req, res) => {
	try {
		const { userId, itemId, rating } = req.body
		await recommendationQueries.addRating(itemId, userId, rating)
		res.status(200).json({
			status: true,
			message: 'Rating Added To Recommendation Engine',
			data: {},
		})
	} catch (err) {
		console.log(err)
	}
}

exports.ratingController = {
	addRating,
}
