import type { ConfigurationType, Model } from '#content/models/types.js'
import { useFingerprint } from '#context/Fingerprint.js'
import { useModels } from '#context/Models.js'
import { useParameters } from '#context/Parameters.js'
import {
	isConfig,
	isDeviceInformation,
	toConfig,
	toDeviceInformation,
} from '#proto/lwm2m.js'
import { validPassthrough } from '#proto/validPassthrough.js'
import {
	validatingFetch,
	type FetchProblem,
	type ResultHandlers,
} from '#utils/validatingFetch.js'
import {
	LwM2MObjectID,
	type LwM2MObjectInstance,
} from '@hello.nrfcloud.com/proto-map/lwm2m'
import {
	Context,
	type DeviceIdentity,
	type FOTAJob,
	type LwM2MObjectUpdate,
	type Shadow,
} from '@hello.nrfcloud.com/proto/hello'
import { Type, type Static } from '@sinclair/typebox'
import { isObject } from 'lodash-es'
import { createContext, type ComponentChildren } from 'preact'
import { useContext, useEffect, useRef, useState } from 'preact/hooks'
import { instanceKey, mergeInstances } from '../proto/mergeInstances.js'

export type Device = {
	id: string
	model: Model
	hideDataBefore?: Date
}

type UpdateResult = Promise<{ success: true } | { problem: FetchProblem }>

const EmptyResponse = Type.Undefined()

type FOTAJobListener = (job: Static<typeof FOTAJob>) => void

export const DeviceContext = createContext<{
	device?: Device | undefined
	unsupported?: {
		id: string
	}
	imei?: string
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
		desired: ConfigurationType
		reported: ConfigurationType
	}>
	configure: (config: ConfigurationType) => UpdateResult
	debug: boolean
	setDebug: (debug: boolean) => void
	hasLiveData: boolean
	hideDataBefore: () => ResultHandlers<typeof EmptyResponse>
	onFOTAJob: (listener: FOTAJobListener) => {
		remove: () => void
	}
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
	onFOTAJob: () => ({
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
	hideDataBefore: () => {
		throw new Error(`Not implemented!`)
	},
})

export type ListenerFn = (instance: LwM2MObjectInstance) => unknown

export const Provider = ({ children }: { children: ComponentChildren }) => {
	const [device, setDevice] = useState<Device | undefined>(undefined)
	const [debug, setDebug] = useState<boolean>(false)
	const [lastSeen, setLastSeen] = useState<Date | undefined>(undefined)
	const [hasLiveData, setHasLiveData] = useState<boolean>(false)
	const [connectionFailed, setConnectionFailed] = useState<boolean>(false)
	const { fingerprint } = useFingerprint()
	const { onParameters } = useParameters()
	const { models } = useModels()
	const [ws, setWebsocket] = useState<WebSocket>()
	const [disconnected, setDisconnected] = useState<boolean>(false)
	const [desiredConfig, setDesiredConfig] = useState<
		ConfigurationType | undefined
	>()
	const [reportedConfig, setReportedConfig] = useState<
		ConfigurationType | undefined
	>()
	const [reported, setReported] = useState<Record<string, LwM2MObjectInstance>>(
		{},
	)
	const reportedListeners = useRef<Array<ListenerFn>>([])
	const [desired, setDesired] = useState<Record<string, LwM2MObjectInstance>>(
		{},
	)
	const desiredListeners = useRef<Array<ListenerFn>>([])
	const fotaJobListeners = useRef<Array<FOTAJobListener>>([])
	const [helloApiURL, setHelloApiURL] = useState<URL>()
	const [unsupported, setUnsupported] = useState<{ id: string } | undefined>(
		undefined,
	)

	const connected = ws !== undefined

	useEffect(() => {
		onParameters(async ({ helloApiURL }) => {
			setHelloApiURL(helloApiURL)
		})
	}, [onParameters])

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
						const type = models[maybeValid.model]
						if (type !== undefined) {
							setDevice({
								id: maybeValid.id,
								model: type,
								hideDataBefore:
									maybeValid.hideDataBefore !== undefined
										? new Date(maybeValid.hideDataBefore)
										: undefined,
							})
							if (maybeValid.lastSeen !== undefined) {
								setLastSeen(new Date(maybeValid.lastSeen))
							}
						} else if (maybeValid.model === 'unsupported') {
							setUnsupported({ id: maybeValid.id })
						} else {
							setUnsupported({ id: maybeValid.id })
							console.error(
								`[WS]`,
								`Device model not found: ${maybeValid.model}`,
							)
						}
					} else if (isShadow(maybeValid)) {
						const reported = maybeValid.reported
						if (reported.length > 0) {
							setReported(mergeInstances(reported))
							reportedListeners.current.forEach((listener) =>
								reported.map(listener),
							)
							const maybeConfig = reported.filter(isConfig).map(toConfig)[0]
							if (maybeConfig !== undefined) {
								setReportedConfig(maybeConfig)
							}
						}
						const desired = maybeValid.desired
						if (desired.length > 0) {
							setDesired(mergeInstances(desired))
							desiredListeners.current.forEach((listener) =>
								desired.map(listener),
							)
							const maybeConfig = desired.filter(isConfig).map(toConfig)[0]
							if (maybeConfig !== undefined) {
								setDesiredConfig(maybeConfig)
							}
						}
					} else if (isUpdate(maybeValid)) {
						setReported(mergeInstances([maybeValid]))
						reportedListeners.current.forEach((listener) =>
							listener(maybeValid),
						)
						setLastSeen((l) => {
							const ts = maybeValid.Resources[99] as number
							if (ts === undefined) return l
							if (l === undefined) return new Date(ts * 1000)
							return ts * 1000 > l.getTime() ? new Date(ts * 1000) : l
						})
					} else if (isFOTAJob(maybeValid)) {
						fotaJobListeners.current.forEach((listener) => listener(maybeValid))
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

	// Update `hasLiveData` based on lastSeen and reportedConfig
	useEffect(() => {
		let hasLiveData =
			lastSeen !== undefined &&
			(device?.hideDataBefore === undefined ||
				lastSeen.getTime() > device.hideDataBefore.getTime())

		const updateIntervalSeconds =
			reportedConfig?.updateIntervalSeconds ??
			device?.model.defaultConfiguration.updateIntervalSeconds
		if (lastSeen !== undefined && updateIntervalSeconds !== undefined) {
			hasLiveData =
				Date.now() - lastSeen.getTime() < updateIntervalSeconds * 1000
		}
		setHasLiveData(hasLiveData)
	}, [device, lastSeen, reportedConfig])

	const update = async (instance: LwM2MObjectInstance): UpdateResult => {
		if (device === undefined) throw new Error(`Device not yet loaded!`)
		if (fingerprint === null) throw new Error(`fingerprint not available!`)
		if (helloApiURL === undefined) throw new Error(`helloApiURL not available!`)
		const url = new URL(
			`./device/${device.id}/state?${new URLSearchParams({ fingerprint }).toString()}`,
			helloApiURL,
		)
		try {
			await fetch(url, {
				method: 'PATCH',
				mode: 'cors',
				body: JSON.stringify({
					'@context': Context.lwm2mObjectUpdate.toString(),
					...instance,
				}),
				headers: {
					'Content-Type': 'application/json; charset=utf-8',
				},
			})
			setDesired(mergeInstances([instance]))
			return { success: true }
		} catch (err) {
			console.error('[DeviceContext]', 'Configuration update failed', err)
			return {
				problem: {
					url,
					problem: {
						'@context': Context.problemDetail.toString(),
						title: 'Failed to update configuration!',
						detail: (err as Error).message,
					},
				},
			}
		}
	}

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
				onFOTAJob: (fn) => {
					fotaJobListeners.current.push(fn)
					return {
						remove: () => {
							fotaJobListeners.current = fotaJobListeners.current.filter(
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
							'99': Math.floor(Date.now() / 1000),
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
				hideDataBefore: () => {
					if (device === undefined) throw new Error(`Device not yet loaded!`)
					if (fingerprint === null)
						throw new Error(`fingerprint not available!`)
					if (helloApiURL === undefined)
						throw new Error(`helloApiURL not available!`)
					return validatingFetch(EmptyResponse)(
						new URL(
							`./device/${device.id}/hideDataBefore?${new URLSearchParams({ fingerprint }).toString()}`,
							helloApiURL,
						),
						undefined,
						'POST',
					).ok(() => {
						setDevice((d) => {
							if (d === undefined) return d
							return { ...d, hideDataBefore: new Date() }
						})
					})
				},
				imei: Object.values(reported)
					.filter(isDeviceInformation)
					.map(toDeviceInformation)[0]?.imei,
				unsupported,
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

const isFOTAJob = (message: unknown): message is Static<typeof FOTAJob> =>
	isObject(message) &&
	'@context' in message &&
	message['@context'] === Context.fotaJob.toString()
