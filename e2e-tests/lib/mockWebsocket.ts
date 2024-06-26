import { createServer } from 'http'
import { server as WebSocketServer } from 'websocket'
import type { Static } from '@sinclair/typebox'
import { Context, type DeviceIdentity } from '@hello.nrfcloud.com/proto/hello'

const randomIMEI = () =>
	(350006660000000 + Math.floor(Math.random() * 10000000)).toString()

export const mockWebsocket = (port: number): void => {
	const server = createServer()
	const wsServer = new WebSocketServer({
		httpServer: server,
	})
	server.listen(port, () => {
		console.debug(`[WS]`, `Listening on ws://localhost:${port}`)
	})
	wsServer.on('request', (request) => {
		const fingerprint = request.resourceURL.query['fingerprint']
		if (fingerprint === '29a.n3d4t4') {
			console.debug(`[WS]`, fingerprint, 'connected')
			const connection = request.accept(undefined, request.origin)
			const identity: Static<typeof DeviceIdentity> = {
				'@context': Context.deviceIdentity.toString(),
				id: `oob-${randomIMEI()}`,
				model: 'PCA20065',
			}
			connection.send(JSON.stringify(identity))
		} else {
			request.reject(404, 'Not found')
		}
	})
}
