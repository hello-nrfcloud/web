import { Context, DeviceIdentity } from '@hello.nrfcloud.com/proto/hello'
import { type Static } from '@sinclair/typebox'
import { createContext, type ComponentChildren } from 'preact'
import {
	useCallback,
	useContext,
	useEffect,
	useRef,
	useState,
} from 'preact/hooks'
import type { IncomingMessageType, OutgoingMessageType } from '#proto/proto.js'
import { validPassthrough } from '#proto/validPassthrough.js'
import { useFingerprint } from './Fingerprint.js'
import { useModels, type Model } from './Models.js'
import { useParameters } from './Parameters.js'

export type Device = {
	id: string
	model: Model
	lastSeen?: Date
}

export const DeviceContext = createContext<{
	type?: Model | undefined
	device?: Device | undefined
	connected: boolean
	connectionFailed: boolean
	disconnected: boolean
	addMessageListener: (listener: MessageListenerFn) => {
		remove: () => void
	}
	send?: (message: OutgoingMessageType) => void
}>({
	connected: false,
	disconnected: false,
	addMessageListener: () => ({
		remove: () => undefined,
	}),
	connectionFailed: false,
})

export type MessageListenerFn = (message: IncomingMessageType) => unknown

export const Provider = ({ children }: { children: ComponentChildren }) => {
	const [device, setDevice] = useState<Device | undefined>(undefined)
	const [type, setType] = useState<string | undefined>(undefined)
	const [connectionFailed, setConnectionFailed] = useState<boolean>(false)
	const [messages, setMessages] = useState<IncomingMessageType[]>([])
	const { fingerprint } = useFingerprint()
	const { onParameters } = useParameters()
	const { models } = useModels()
	const [ws, setWebsocket] = useState<WebSocket>()
	const [disconnected, setDisconnected] = useState<boolean>(false)

	const connected = ws !== undefined
	const listeners = useRef<MessageListenerFn[]>([])

	// Set up websocket connection
	useEffect(() => {
		if (fingerprint === null) return

		let ws: WebSocket | undefined = undefined
		let pingInterval: NodeJS.Timeout

		onParameters(({ webSocketURI }) => {
			const deviceURI = `${webSocketURI.toString()}?fingerprint=${fingerprint}`
			console.debug(`[WS]`, 'connecting', deviceURI)
			ws = new WebSocket(deviceURI)

			ws.addEventListener('open', () => {
				console.debug(`[WS]`, 'connected')
				setWebsocket(ws)
				pingInterval = setInterval(
					() => {
						ws?.send(
							JSON.stringify({
								message: 'message',
								data: 'PING',
							}),
						)
					},
					0.95 * 5 * 60 * 1000,
				) // every ~5 minutes
			})

			ws.addEventListener('error', (err) => {
				console.error(`[WS]`, err)
				setConnectionFailed(true)
			})
			const messageListener = (msg: MessageEvent<any>) => {
				let message: any
				try {
					message = JSON.parse(msg.data)
					const maybeValid = validPassthrough(message, (message, errors) => {
						console.error(`[WS]`, `message dropped`, message, errors)
					})
					if (maybeValid !== null) {
						console.debug(`[WS] <`, maybeValid)
						setMessages((m) => [...m, message])
						if (isDeviceIdentity(maybeValid)) {
							const type = models[maybeValid.model] as Model
							setDevice({
								id: maybeValid.id,
								lastSeen:
									typeof maybeValid.lastSeen === 'string'
										? new Date(maybeValid.lastSeen)
										: undefined,
								model: type,
							})
							setType(maybeValid.model)
						}
						listeners.current.map((listener) => listener(message))
					}
				} catch (err) {
					console.error(`[WS]`, `Failed to parse message as JSON`, msg.data)
					return
				}
			}
			ws.addEventListener('message', messageListener)

			ws.addEventListener('close', () => {
				// This happens automatically after 2 hours
				// See https://docs.aws.amazon.com/apigateway/latest/developerguide/limits.html#apigateway-execution-service-websocket-limits-table
				console.debug(`[WS]`, 'disconnected')
				setWebsocket(undefined)
				ws?.removeEventListener('message', messageListener)
				ws = undefined
				setDisconnected(true)
			})
		})

		return () => {
			ws?.close()
			setWebsocket(undefined)
			pingInterval !== undefined && clearInterval(pingInterval)
		}
	}, [fingerprint])

	const send =
		ws === undefined
			? undefined
			: useCallback(
					(message: OutgoingMessageType) => {
						console.log(`[WS] >`, message)
						ws.send(
							JSON.stringify({
								message: 'message',
								payload: message,
							}),
						)
					},
					[ws],
				)

	return (
		<DeviceContext.Provider
			value={{
				device,
				type: type === undefined ? undefined : models[type],
				connected,
				addMessageListener: (fn) => {
					listeners.current.push(fn)
					messages.map(fn)
					return {
						remove: () => {
							listeners.current = listeners.current.filter((f) => f !== fn)
						},
					}
				},
				connectionFailed,
				send,
				disconnected,
			}}
		>
			{children}
		</DeviceContext.Provider>
	)
}

export const Consumer = DeviceContext.Consumer

export const useDevice = () => useContext(DeviceContext)

const isDeviceIdentity = (
	message: IncomingMessageType,
): message is Static<typeof DeviceIdentity> =>
	message['@context'] === Context.deviceIdentity.toString()
