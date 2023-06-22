'use strict'

// Lambda@Edge must use callback
// see https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/lambda-edge-authoring-functions.html
exports.handler = (event, context, callback) => {
	const request = event.Records[0].cf.request
	const maybeFingerprint = request?.uri?.slice(1) ?? ''
	console.log(JSON.stringify({ maybeFingerprint, request }))

	if (
		/^[A-F0-9]{1,}\.[ABCDEFGHIJKMNPQRSTUVWXYZ2-9]{6}$/i.test(maybeFingerprint)
	) {
		const host = request.headers.host[0].value
		const redirectUrl = `https://${host}/?fingerprint=${maybeFingerprint}`
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
				['content-type']: [
					{ key: 'Content-Type', value: 'text/html; charset=utf-8' },
				],
			},
			body: [
				`<!DOCTYPE html>`,
				`<html lang=en>`,
				`<head>`,
				`<title>${host}/${maybeFingerprint}</title>`,
				`<meta http-equiv="Refresh" content="0; URL=${redirectUrl}">`,
				`</head>`,
				`<p>Connecting you to your device <code>${maybeFingerprint}</code> ...`,
			].join('\n'),
			bodyEncoding: 'text',
		})
	}

	callback(null, request)
}
