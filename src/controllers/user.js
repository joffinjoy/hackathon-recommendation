'use strict'
const { recommendationQueries } = require('@database/graph/recommendation/queries')
const { failedRes } = require('@utils/failedRes')

const addUser = async (req, res) => {
	try {
		const { userId, email, name, phone } = req.body
		const userNode = await recommendationQueries.addUser({ userId, email, name, phone })
		if (!userNode) return failedRes(res, 'Something Went Wrong')
		res.status(200).json({
			status: true,
			message: 'User Added To Recommendation Engine',
			data: userNode,
		})
	} catch (err) {
		console.log(err)
	}
}

const getUserEmails = async (req, res) => {
	try {
		const result = await recommendationQueries.getEmailIds()
		const emails = result.records.map((record) => {
			return record._fields[0]
		})
		//console.log(emails)
		res.status(200).json({
			status: true,
			message: 'User Added To Recommendation Engine',
			data: emails,
		})
	} catch (err) {
		console.log(err)
	}
}

exports.userController = {
	addUser,
	getUserEmails,
}
