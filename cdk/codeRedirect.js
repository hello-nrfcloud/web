'use strict'

// Lambda@Edge must use callback
// see https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/lambda-edge-authoring-functions.html
exports.handler = (event, context, callback) => {
	const request = event.Records[0].cf.request
	const maybeCode = request?.uri?.slice(1) ?? ''
	console.log(JSON.stringify({ maybeCode, request }))

	if (
		/^[ABCDEFGHIJKLMNPQRSTUVWXYZ1-9]{1,}\.[ABCDEFGHIJKLMNPQRSTUVWXYZ1-9]{8}$/i.test(
			maybeCode,
		)
	) {
		const host = request.headers.host[0].value
		const redirectUrl = `https://${host}/?code=${maybeCode}`
		console.log(`Redirecting to`, redirectUrl)
		// See https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/lambda-generating-http-responses-in-requests.html#lambda-generating-http-responses-object
		return callback(null, {
			status: '307',
			statusDescription: 'Temporary Redirect',
			headers: {
				location: [
					{
						key: 'Location',
						value: redirectUrl,
					},
				],
			},
		})
	}

	callback(null, request)
}
