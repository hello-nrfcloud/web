'use strict'

const { lookup } = require('dns/promises')

const allowedClients = Promise.all(
	`%ALLOWED_CLIENTS%`
		.split(',')
		.map(async (clientAddress) => lookup(clientAddress, 4)),
).then((addresses) => addresses.map(({ address }) => address))

exports.handler = (event, context, callback) => {
	const request = event.Records[0].cf.request

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

		// Check if it is a code request
		const maybeCode =
			event.Records?.[0]?.cf?.request?.querystring?.slice(1) ?? ''
		if (/^[0-9]{2}\.[ABCDEFGHIJKLMNPQRSTUVWXYZ1-9]{8}$/i.test(maybeCode)) {
			return callback(null, {
				status: '307',
				statusDescription: 'Temporary Redirect',
				headers: {
					location: `/?code=${maybeCode}`,
				},
			})
		}

		callback(null, request)
	})
}
