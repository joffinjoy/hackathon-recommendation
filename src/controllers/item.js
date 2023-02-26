'use strict'
const { itemService } = require('@services/item')

const addItem = async (req, res) => {
	try {
		const payload = req.body.payload
		const { item, categories, mentor, provider } = payload
		const result = await itemService.addItem({ item, categories, mentor, provider })
		res.status(200).json({
			status: true,
			message: 'Item Added To Recommendation Engine',
			data: {},
		})
	} catch (err) {
		console.log(err)
	}
}

exports.itemController = {
	addItem,
}
