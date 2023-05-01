'use strict'
const { itemService } = require('@services/item')
const { failedRes } = require('@utils/failedRes')

const addItem = async (req, res) => {
	try {
		const payload = req.body.payload
		const { item, categories, mentor, provider } = payload
		const result = await itemService.addItem({ item, categories, mentor, provider })
		res.status(200).json({
			status: true,
			message: 'Item Added To Recommendation Engine',
			data: result,
		})
	} catch (err) {
		console.log(err)
		failedRes(res, 'Something Went Wrong')
	}
}

exports.itemController = {
	addItem,
}
