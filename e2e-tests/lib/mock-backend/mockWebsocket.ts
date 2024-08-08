import type { LwM2MObjectInstance } from '@hello.nrfcloud.com/proto-map/api'
import { shadowToObjects } from '@hello.nrfcloud.com/proto-map/lwm2m/aws'
import {
	Context,
	type DeviceIdentity,
	type Shadow,
} from '@hello.nrfcloud.com/proto/hello'
import type { Static } from '@sinclair/typebox'
import { createServer } from 'http'
import { server as WebSocketServer } from 'websocket'
import type { createContext } from './context.js'

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
		const maybeDevice = context.devices.get(fingerprint as string)
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
			const state = context.deviceState.get(maybeDevice.id)
			if (state !== undefined) {
				const { reported, desired } = state
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
