'use strict'

const cron = require('node-cron')
const { autoSearchQueries } = require('@database/graph/recommendation/autoSearch')
const { internalRequests } = require('@helpers/requests')
const { contentFilteringQueries } = require('@database/graph/recommendation/contentFiltering')

const autoSearchTask = cron.schedule(
	'*/1 * * * *',
	async () => {
		const min = 10
		const max = 20
		const randomSkipCount = Math.floor(Math.random() * (max - min + 1)) + min
		const importantTopics = await autoSearchQueries.getImportantTopics(0, 10)
		const secondaryTopics = await autoSearchQueries.getImportantTopics(randomSkipCount, 5)
		const topics = importantTopics.records.concat(secondaryTopics.records)
		console.log(topics)
		for (const record of topics) {
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
		//console.log('Smar', command)
		if (command === 'start') {
			console.log('SMART AUTO-SEARCH STARTED')
			autoSearchTask.start()
		} else {
			console.log('SMART AUTO-SEARCH STOPPED')
			autoSearchTask.stop()
		}
	} catch (err) {
		console.log(err)
	}
}

exports.autoSearchService = { triggerAutoSearch }
