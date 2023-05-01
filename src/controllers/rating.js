'use strict'
const { edgeQueries } = require('@database/graph/recommendation/edgeQueries')

const addRating = async (req, res) => {
	try {
		const { userId, itemId, rating } = req.body
		await edgeQueries.createRatedEdge(itemId, userId, rating)
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
