'use strict'
const { externalPOSTRequest, internalPOSTRequest } = require('@utils/requester')

exports.externalRequests = {
	//dsepPOST: externalPOSTRequest(),
}

exports.internalRequests = {
	bapPOST: internalPOSTRequest(process.env.BAP_URI),
}
