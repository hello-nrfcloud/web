import { createServer } from 'http'
import { server as WebSocketServer } from 'websocket'
import type { Static } from '@sinclair/typebox'
import { Context, type DeviceIdentity } from '@hello.nrfcloud.com/proto/hello'
import type { createContext } from './mock-backend/context.js'

export const mockWebsocket = (
	port: number,
	context: ReturnType<typeof createContext>,
): void => {
	const server = createServer()
	const wsServer = new WebSocketServer({
		httpServer: server,
	})
	server.listen(port, () => {
		console.debug(`[WS]`, `Listening on ws://localhost:${port}`)
	})
	wsServer.on('request', (request) => {
		const fingerprint = request.resourceURL.query['fingerprint']
		const maybeDevice = context.devices.find(
			(device) => device.fingerprint === fingerprint,
		)
		if (maybeDevice !== undefined) {
			console.debug(`[WS]`, fingerprint, 'connected')
			const connection = request.accept(undefined, request.origin)
			const identity: Static<typeof DeviceIdentity> = {
				'@context': Context.deviceIdentity.toString(),
				id: maybeDevice.id,
				model: maybeDevice.model,
			}
			connection.send(JSON.stringify(identity))
		} else {
			console.debug(`[WS]`, `Device not found for fingerprint`, fingerprint)
			request.reject(404, 'Not found')
		}
	})
}
