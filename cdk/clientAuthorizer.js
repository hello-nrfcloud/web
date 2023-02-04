'use strict'

const { lookup } = require('dns/promises')

const allowedClients = Promise.all(
	`%ALLOWED_CLIENTS%`
		.split(',')
		.map(async (clientAddress) => lookup(clientAddress, 4)),
).then((addresses) => addresses.map(({ address }) => address))

exports.handler = (event, context, callback) => {
	const request = event.Records[0].cf.request

	console.log(
		JSON.stringify({
			request,
		}),
	)

	allowedClients.then((addresses) => {
		console.debug({ addresses })
		if (!addresses.includes(request.clientIp)) {
			console.error(request.clientIp, `not allowed`)
			return callback(null, {
				body: `${request.clientIp} not allowed, sorry. Contact access@nrf.guide to request access.`,
				bodyEncoding: 'text',
				status: '403',
				statusDescription: 'Forbidden',
			})
		}

		callback(null, request)
	})
}
