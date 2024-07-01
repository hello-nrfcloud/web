import { type IncomingMessage, type ServerResponse } from 'http'

export const sendJSON = (
	res: ServerResponse<IncomingMessage>,
	payload: Record<string, unknown>,
	statusCode?: number,
): void => {
	const payloadJSON = JSON.stringify(payload)
	console.debug(`>`, payloadJSON)
	res.setHeader('Content-type', 'application/json; charset=utf-8')
	res.setHeader('Content-length', payloadJSON.length.toString())
	res.write(payloadJSON)
	sendStatus(res, statusCode ?? 200)
}

export const sendText = (
	res: ServerResponse<IncomingMessage>,
	payload: string,
): void => {
	res.setHeader('Content-type', 'application/text; charset=utf-8')
	res.setHeader('Content-length', payload.length.toString())
	res.write(payload)
	sendStatus(res, 200)
}

export const sendStatus = (
	res: ServerResponse<IncomingMessage>,
	statusCode: number,
): void => {
	res.statusCode = statusCode
	res.end()
}
export const getBody = async (req: IncomingMessage): Promise<string> =>
	new Promise((resolve, reject) => {
		const t = setTimeout(() => reject(new Error(`Timeout`)), 1000)
		let requestData = ''
		req.on('data', (data) => {
			requestData += data
		})
		req.on('end', () => {
			resolve(requestData)
			clearTimeout(t)
		})
	})

export const getJSON = async (
	req: IncomingMessage,
): Promise<Record<string, any>> => JSON.parse(await getBody(req))
