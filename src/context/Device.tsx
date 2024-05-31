import { useFingerprint } from '#context/Fingerprint.js'
import { useModels, type Configuration, type Model } from '#context/Models.js'
import { useParameters } from '#context/Parameters.js'
import { isConfig } from '#proto/lwm2m.js'
import { validPassthrough } from '#proto/validPassthrough.js'
import {
	LwM2MObjectID,
	type LwM2MObjectInstance,
} from '@hello.nrfcloud.com/proto-map/lwm2m'
import {
	Context,
	type DeviceIdentity,
	type LwM2MObjectUpdate,
	type ProblemDetail,
	type Shadow,
} from '@hello.nrfcloud.com/proto/hello'
import { type Static } from '@sinclair/typebox'
import { isObject } from 'lodash-es'
import { createContext, type ComponentChildren } from 'preact'
import { useContext, useEffect, useRef, useState } from 'preact/hooks'

export type Device = {
	id: string
	model: Model
}

type UpdateResult = Promise<
	{ success: true } | { problem: Static<typeof ProblemDetail> }
>

export const DeviceContext = createContext<{
	device?: Device | undefined
	lastSeen?: Date
	connected: boolean
	connectionFailed: boolean
	disconnected: boolean
	onReported: (listener: ListenerFn) => {
		remove: () => void
	}
	reported: Record<string, LwM2MObjectInstance>
	onDesired: (listener: ListenerFn) => {
		remove: () => void
	}
	desired: Record<string, LwM2MObjectInstance>
	update: (instance: LwM2MObjectInstance) => UpdateResult
	configuration: Partial<{
		desired: Configuration
		reported: Configuration
	}>
	configure: (config: Configuration) => UpdateResult
	debug: boolean
	setDebug: (debug: boolean) => void
	hasLiveData: boolean
}>({
	connected: false,
	disconnected: false,
	onReported: () => ({
		remove: () => undefined,
	}),
	reported: {},
	onDesired: () => ({
		remove: () => undefined,
	}),
	desired: {},
	connectionFailed: false,
	configuration: {},
	configure: async () => Promise.reject(new Error('Not implemented')),
	update: async () => Promise.reject(new Error('Not implemented')),
	debug: false,
	setDebug: () => undefined,
	hasLiveData: false,
})

export type ListenerFn = (instance: LwM2MObjectInstance) => unknown

export const Provider = ({ children }: { children: ComponentChildren }) => {
	const [device, setDevice] = useState<Device | undefined>(undefined)
	const [debug, setDebug] = useState<boolean>(false)
	const [lastSeen, setLastSeen] = useState<Date | undefined>(undefined)
	const [connectionFailed, setConnectionFailed] = useState<boolean>(false)
	const { fingerprint } = useFingerprint()
	const { onParameters } = useParameters()
	const { models } = useModels()
	const [ws, setWebsocket] = useState<WebSocket>()
	const [disconnected, setDisconnected] = useState<boolean>(false)
	const [desiredConfig, setDesiredConfig] = useState<
		Configuration | undefined
	>()
	const [reportedConfig, setReportedConfig] = useState<
		Configuration | undefined
	>()

	const connected = ws !== undefined
	const [reported, setReported] = useState<Record<string, LwM2MObjectInstance>>(
		{},
	)
	const reportedListeners = useRef<Array<ListenerFn>>([])
	const [desired, setDesired] = useState<Record<string, LwM2MObjectInstance>>(
		{},
	)
	const desiredListeners = useRef<Array<ListenerFn>>([])

	useEffect(() => {
		const config =
			reported[instanceKey(LwM2MObjectID.ApplicationConfiguration_14301)]
		if (!isConfig(config)) return
		setReportedConfig({
			updateIntervalSeconds: config.Resources[0],
			gnssEnabled: config.Resources[1],
		})
	}, [reported])

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
						const reported = maybeValid.reported
						if (reported.length > 0) {
							setReported(mergeInstances(reported))
							reportedListeners.current.forEach((listener) =>
								reported.map(listener),
							)
						}
						const desired = maybeValid.desired
						if (desired.length > 0) {
							setDesired(mergeInstances(desired))
							desiredListeners.current.forEach((listener) =>
								desired.map(listener),
							)
						}
					} else if (isUpdate(maybeValid)) {
						setReported(mergeInstances([maybeValid]))
						reportedListeners.current.forEach((listener) =>
							listener(maybeValid),
						)
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

	let hasLiveData = lastSeen !== undefined
	if (
		lastSeen !== undefined &&
		reportedConfig?.updateIntervalSeconds !== undefined
	) {
		hasLiveData =
			Date.now() - lastSeen.getTime() <
			reportedConfig?.updateIntervalSeconds * 1000
	}

	const update = async (instance: LwM2MObjectInstance): UpdateResult =>
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
								...instance,
							}),
						},
					)
					resolve({ success: true })
				} catch (err) {
					console.error('[DeviceContext]', 'Configuration update failed', err)
					resolve({
						problem: {
							'@context': Context.problemDetail.toString(),
							title: 'Failed to update configuration!',
							detail: (err as Error).message,
						},
					})
				}
			})
		})

	return (
		<DeviceContext.Provider
			value={{
				device,
				lastSeen,
				connected,
				onReported: (fn) => {
					reportedListeners.current.push(fn)
					Object.values(reported).map(fn)
					return {
						remove: () => {
							reportedListeners.current = reportedListeners.current.filter(
								(f) => f !== fn,
							)
						},
					}
				},
				reported,
				onDesired: (fn) => {
					desiredListeners.current.push(fn)
					Object.values(desired).map(fn)
					return {
						remove: () => {
							desiredListeners.current = desiredListeners.current.filter(
								(f) => f !== fn,
							)
						},
					}
				},
				desired,
				connectionFailed,
				disconnected,
				configuration: {
					reported: reportedConfig,
					desired: desiredConfig,
				},
				configure: async (config) =>
					update({
						ObjectID: LwM2MObjectID.ApplicationConfiguration_14301,
						Resources: {
							'0': config.updateIntervalSeconds,
							'1': config.gnssEnabled,
							'99': Date.now(),
						},
					}).then((res) => {
						if (!('problem' in res)) {
							setDesiredConfig(config)
						}
						return res
					}),
				update,
				debug,
				setDebug,
				hasLiveData,
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

const instanceKey = (
	ObjectID: LwM2MObjectInstance['ObjectID'],
	ObjectInstanceID: LwM2MObjectInstance['ObjectInstanceID'] = 0,
): string => `${ObjectID}/${ObjectInstanceID}`

const mergeInstances =
	(reported: Array<LwM2MObjectInstance>) =>
	(
		current: Record<string, LwM2MObjectInstance>,
	): Record<string, LwM2MObjectInstance> => ({
		...current,
		...reported.reduce<Record<string, LwM2MObjectInstance>>((acc, instance) => {
			acc[instanceKey(instance.ObjectID, instance.ObjectInstanceID)] = {
				...(acc[instanceKey(instance.ObjectID, instance.ObjectInstanceID)] ??
					{}),
				...instance,
			}
			return acc
		}, {}),
	})
