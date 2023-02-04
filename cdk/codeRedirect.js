'use strict'

exports.handler = (event) => {
	const request = event.request
	const maybeCode = request?.uri?.slice(1) ?? ''
	console.log(JSON.stringify({ maybeCode, request }))

	if (/^[0-9]{2}\.[ABCDEFGHIJKLMNPQRSTUVWXYZ1-9]{8}$/i.test(maybeCode)) {
		const host = request.headers.host.value
		const redirectUrl = `https://${host}/?code=${maybeCode}`
		return {
			status: '307',
			statusDescription: 'Temporary Redirect',
			headers: {
				location: { value: redirectUrl },
			},
		}
	}
	return request
}
