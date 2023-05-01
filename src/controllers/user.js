'use strict'
const { nodeQueries } = require('@database/graph/nodeQueries')
const { readQueries } = require('@database/graph/readQueries')
const { failedRes } = require('@utils/failedRes')

const addUser = async (req, res) => {
	try {
		const { userId, email, name, phone } = req.body
		const userNode = await nodeQueries.addUser({ userId, email, name, phone })
		res.status(200).json({
			status: true,
			message: 'User Added To Recommendation Engine',
			data: userNode.properties,
		})
	} catch (err) {
		console.log(err)
		failedRes(res, 'Something Went Wrong')
	}
}

const getUserEmails = async (req, res) => {
	try {
		const result = await readQueries.getEmailIds()
		const emails = result.records.map((record) => {
			return record._fields[0]
		})
		res.status(200).json({
			status: true,
			message: 'All User Emails Fetched Successfully',
			data: emails,
		})
	} catch (err) {
		console.log(err)
		failedRes(res, 'Something Went Wrong')
	}
}

exports.userController = {
	addUser,
	getUserEmails,
}
