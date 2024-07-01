import { createServer } from 'http'
import { server as WebSocketServer } from 'websocket'
import type { Static } from '@sinclair/typebox'
import {
	Context,
	type Shadow,
	type DeviceIdentity,
} from '@hello.nrfcloud.com/proto/hello'
import type { createContext } from './mock-backend/context.js'
import { shadowToObjects } from '@hello.nrfcloud.com/proto-map/lwm2m/aws'
import type { LwM2MObjectInstance } from '@hello.nrfcloud.com/proto-map/api'

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
				lastSeen: maybeDevice.lastSeen,
			}
			connection.send(JSON.stringify(identity))
			// Return shadow
			if (context.deviceState[maybeDevice.id] !== undefined) {
				const { reported, desired } = context.deviceState[maybeDevice.id] ?? {
					reported: {},
					desired: {},
				}
				const shadow: Static<typeof Shadow> = {
					'@context': Context.shadow.toString(),
					reported: shadowToObjects(reported) as Array<
						Static<typeof LwM2MObjectInstance>
					>,
					desired: shadowToObjects(desired) as Array<
						Static<typeof LwM2MObjectInstance>
					>,
				}
				connection.send(JSON.stringify(shadow))
			}
		} else {
			console.debug(`[WS]`, `Device not found for fingerprint`, fingerprint)
			request.reject(404, 'Not found')
		}
	})
}
