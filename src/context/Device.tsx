import {
	Context,
	type ProblemDetail,
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
import {
	DefaultConfiguration,
	useModels,
	type Configuration,
	type Model,
} from '#context/Models.js'
import { useParameters } from '#context/Parameters.js'
import {
	LwM2MObjectID,
	type LwM2MObjectInstance,
} from '@hello.nrfcloud.com/proto-map/lwm2m'
import { isObject } from 'lodash-es'

export type Device = {
	id: string
	model: Model
}

export const DeviceContext = createContext<{
	device?: Device | undefined
	lastSeen?: Date
	connected: boolean
	connectionFailed: boolean
	disconnected: boolean
	addMessageListener: (listener: MessageListenerFn) => {
		remove: () => void
	}
	send?: (message: LwM2MObjectInstance) => void
	configuration: {
		desired: Configuration
		reported: Configuration
	}
	configure: (
		config: Configuration,
	) => Promise<{ success: true } | { problem: Static<typeof ProblemDetail> }>
}>({
	connected: false,
	disconnected: false,
	addMessageListener: () => ({
		remove: () => undefined,
	}),
	connectionFailed: false,
	configuration: {
		desired: DefaultConfiguration,
		reported: DefaultConfiguration,
	},
	configure: async () => Promise.reject(new Error('Not implemented')),
})

export type MessageListenerFn = (message: LwM2MObjectInstance) => unknown

export const Provider = ({ children }: { children: ComponentChildren }) => {
	const [device, setDevice] = useState<Device | undefined>(undefined)
	const [lastSeen, setLastSeen] = useState<Date | undefined>(undefined)
	const [connectionFailed, setConnectionFailed] = useState<boolean>(false)
	const [messages, setMessages] = useState<LwM2MObjectInstance[]>([])
	const { fingerprint } = useFingerprint()
	const { onParameters } = useParameters()
	const { models } = useModels()
	const [ws, setWebsocket] = useState<WebSocket>()
	const [disconnected, setDisconnected] = useState<boolean>(false)
	const [desiredConfig, setDesiredConfig] =
		useState<Configuration>(DefaultConfiguration)
	// FIXME: update reported config
	const [reportedConfig] = useState<Configuration>(DefaultConfiguration)

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
							model: type ?? models['unsupported'],
						})
						if (maybeValid.lastSeen !== undefined) {
							setLastSeen(new Date(maybeValid.lastSeen))
						}
					} else if (isShadow(maybeValid)) {
						const instances = maybeValid.reported
						setMessages((m) => [...m, ...instances])
						listeners.current.forEach((listener) => instances.map(listener))
					} else if (isUpdate(maybeValid)) {
						setMessages((m) => [...m, maybeValid])
						listeners.current.forEach((listener) => listener(maybeValid))
						setLastSeen((l) => {
							const ts = maybeValid.Resources[99] as number
							if (ts === undefined) return l
							if (l === undefined) return new Date(ts)
							return ts > l.getTime() ? new Date(ts) : l
						})
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
				lastSeen,
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
				configuration: {
					reported: reportedConfig,
					desired: desiredConfig,
				},
				configure: async (config) =>
					new Promise((resolve) => {
						onParameters(async ({ helloApiURL }) => {
							if (device === undefined) return
							if (fingerprint === null) return
							try {
								await fetch(
									new URL(
										`./device/${device.id}/state?${new URLSearchParams({ fingerprint }).toString()}`,
										helloApiURL,
									),
									{
										method: 'PATCH',
										mode: 'cors',
										body: JSON.stringify({
											'@context': Context.lwm2mObjectUpdate.toString(),
											ObjectID: LwM2MObjectID.ApplicationConfiguration_14301,
											Resources: {
												'0': config.mode,
												'1': config.gnssEnabled,
												'99': Date.now(),
											},
										}),
									},
								)
								setDesiredConfig(config)
								resolve({ success: true })
							} catch (err) {
								console.error(
									'[DeviceContext]',
									'Configuration update failed',
									err,
								)
								resolve({
									problem: {
										'@context': Context.problemDetail.toString(),
										title: 'Failed to update configuration!',
										detail: (err as Error).message,
									},
								})
							}
						})
					}),
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
