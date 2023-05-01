'use strict'
const { edgeQueries } = require('@database/graph/edgeQueries')
const { failedRes } = require('@utils/failedRes')

const addRating = async (req, res) => {
	try {
		const { userId, itemId, rating } = req.body
		const { item, user, rated } = await edgeQueries.createRatedEdge(itemId, userId, rating)
		res.status(200).json({
			status: true,
			message: 'Rating Added To Recommendation Engine',
			data: { item: item.properties, user: user.properties, rated: rated.properties },
		})
	} catch (err) {
		console.log(err)
		failedRes(res, 'Something Went Wrong')
	}
}

exports.ratingController = {
	addRating,
}
