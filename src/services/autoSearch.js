'use strict'

const cron = require('node-cron')
const { autoSearchQueries } = require('@database/graph/recommendation/autoSearch')
const { internalRequests } = require('@helpers/requests')
const { contentFilteringQueries } = require('@database/graph/recommendation/contentFiltering')

const autoSearchTask = cron.schedule(
	'*/5 * * * *',
	async () => {
		const importantTopics = await autoSearchQueries.getImportantTopics()
		for (const record of importantTopics.records) {
			console.log(record.get('topic'), ' : ', record.get('pageRank'))
			await internalRequests.bapPOST({
				route: process.env.BAP_DSEP_SEARCH,
				body: {
					sessionTitle: record.get('topic'),
					type: 'session',
				},
			})
		}
		await contentFilteringQueries.deleteProjection()
		await contentFilteringQueries.deleteContentSimilarRelationships()
		await contentFilteringQueries.generateProjection()
		await contentFilteringQueries.runNodeSimilarity()
	},
	{
		scheduled: false,
	}
)

const triggerAutoSearch = async (command) => {
	try {
		console.log('HERE', command)
		if (command === 'start') autoSearchTask.start()
		else autoSearchTask.stop()
	} catch (err) {
		console.log(err)
	}
}

exports.autoSearchService = { triggerAutoSearch }
