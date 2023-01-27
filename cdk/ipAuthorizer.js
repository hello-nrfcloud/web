'use strict'

const allowedIps = `%ALLOWED_IPS%`.split(',')

exports.handler = (event, context, callback) => {
	const request = event.Records[0].cf.request
	const headers = request.headers

	console.log(JSON.stringify({ request, headers, allowedIps }))

	if (!allowedIps.includes(request.clientIp)) {
		return callback(null, {
			status: '403',
			statusDescription: 'Forbidden',
		})
	}

	callback(null, request)
}
