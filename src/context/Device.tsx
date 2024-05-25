import {
	Context,
	type DeviceIdentity,
	type LwM2MObjectUpdate,
	type Shadow,
} from '@hello.nrfcloud.com/proto/hello'
import { type Static } from '@sinclair/typebox'
import { createContext, type ComponentChildren } from 'preact'
import {
	useCallback,
	useContext,
	useEffect,
	useRef,
	useState,
} from 'preact/hooks'
import { validPassthrough } from '#proto/validPassthrough.js'
import { useFingerprint } from '#context/Fingerprint.js'
import { useModels, type Model } from '#context/Models.js'
import { useParameters } from '#context/Parameters.js'
import type { LwM2MObjectInstance } from '@hello.nrfcloud.com/proto-map/lwm2m'
import { isObject } from 'lodash-es'

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
	send?: (message: LwM2MObjectInstance) => void
}>({
	connected: false,
	disconnected: false,
	addMessageListener: () => ({
		remove: () => undefined,
	}),
	connectionFailed: false,
})

export type MessageListenerFn = (message: LwM2MObjectInstance) => unknown

export const Provider = ({ children }: { children: ComponentChildren }) => {
	const [device, setDevice] = useState<Device | undefined>(undefined)
	const [type, setType] = useState<string | undefined>(undefined)
	const [connectionFailed, setConnectionFailed] = useState<boolean>(false)
	const [messages, setMessages] = useState<LwM2MObjectInstance[]>([])
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
				} catch (err) {
					console.error(`[WS]`, `Failed to parse message as JSON`, msg.data)
					return
				}
				if (message === undefined) return
				const maybeValid = validPassthrough(message, (message, errors) => {
					console.error(`[WS]`, `message dropped`, message, errors)
				})
				if (maybeValid !== null) {
					console.debug(`[WS] <`, maybeValid)
					if (isDeviceIdentity(maybeValid)) {
						const type = models[maybeValid.model] as Model
						setDevice({
							id: maybeValid.id,
							lastSeen:
								typeof maybeValid.lastSeen === 'string'
									? new Date(maybeValid.lastSeen)
									: undefined,
							model: type ?? models['unsupported'],
						})
						setType(maybeValid.model)
					} else if (isShadow(maybeValid)) {
						const instances = maybeValid.reported.map(parseInstanceTimestamp)
						setMessages((m) => [...m, ...instances])
						listeners.current.forEach((listener) => instances.map(listener))
					} else if (isUpdate(maybeValid)) {
						const instance = parseInstanceTimestamp(maybeValid)
						setMessages((m) => [...m, instance])
						listeners.current.forEach((listener) => listener(instance))
					}
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
					(message: LwM2MObjectInstance) => {
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
	message: unknown,
): message is Static<typeof DeviceIdentity> =>
	isObject(message) &&
	'@context' in message &&
	message['@context'] === Context.deviceIdentity.toString()

const isShadow = (message: unknown): message is Static<typeof Shadow> =>
	isObject(message) &&
	'@context' in message &&
	message['@context'] === Context.shadow.toString()

const isUpdate = (
	message: unknown,
): message is Static<typeof LwM2MObjectUpdate> =>
	isObject(message) &&
	'@context' in message &&
	message['@context'] === Context.lwm2mObjectUpdate.toString()

const parseInstanceTimestamp = (
	i: LwM2MObjectInstance,
): LwM2MObjectInstance => ({
	...i,
	Resources: {
		...i.Resources,
		99: new Date(i.Resources[99] as number),
	},
})
