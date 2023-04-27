'use strict'

const { lookup } = require('dns/promises')
const path = require('path')

const allowedClients = Promise.all(
	`%ALLOWED_CLIENTS%`
		.split(',')
		.map(async (clientAddress) => lookup(clientAddress, 4)),
).then((addresses) => addresses.map(({ address }) => address))

/**
 * If a folder is requested, load the index.html in the folder
 *
 * This is because of the need to only make the website available for certain
 * IPs, the S3 bucket is not public, and website hosting is disabled.
 *
 * TODO: remove me once the IP protection is no longer needed
 */
const addIndex = (s) => {
	const p = path.parse(s)
	// Request has a file extension
	if (p.ext !== '') return s
	return `${s.replace(/\/$/, '')}/index.html`
}

// Lambda@Edge must use callback
// see https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/lambda-edge-authoring-functions.html
exports.handler = (event, context, callback) => {
	const request = event.Records[0].cf.request

	console.log(
		JSON.stringify({
			request,
		}),
	)

	const modifiedUri = addIndex(request.uri)
	if (modifiedUri !== request.uri) {
		console.log(`Modified requested URI from`, request.uri, 'to', modifiedUri)
		request.uri = modifiedUri
	}

	allowedClients.then((addresses) => {
		console.debug({ addresses })
		if (!addresses.includes(request.clientIp)) {
			console.error(request.clientIp, `not allowed`)
			return callback(null, {
				body: `${request.clientIp} not allowed, sorry.`,
				bodyEncoding: 'text',
				status: '403',
				statusDescription: 'Forbidden',
			})
		}

		callback(null, request)
	})
}
