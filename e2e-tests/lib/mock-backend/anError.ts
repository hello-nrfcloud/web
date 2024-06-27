import { type IncomingMessage, type ServerResponse } from 'http'

export const anError = (
	res: ServerResponse<IncomingMessage>,
	statusCode: number,
): void => {
	res.statusCode = statusCode
	res.end()
}
