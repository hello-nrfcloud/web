import {
	Context,
	DeviceIdentity,
	HelloMessage,
} from '@hello.nrfcloud.com/proto/hello'
import { type Static } from '@sinclair/typebox'
import { createContext, type ComponentChildren } from 'preact'
import { useContext, useEffect, useRef, useState } from 'preact/hooks'
import { useDKs, type DK } from './DKs.js'
import { useFingerprint } from './Fingerprint.js'
import { useParameters } from './Parameters.js'
import { validPassthrough } from '../proto/validPassthrough.js'

export type Device = {
	id: string
	type: DK
	lastSeen?: Date
}

type Messages = {
	received: Date
	message: Static<typeof HelloMessage>
}[]

export const DeviceContext = createContext<{
	type?: DK | undefined
	device?: Device | undefined
	connected: boolean
	connectionFailed: boolean
	messages: Messages
	addMessageListener: (listener: MessageListenerFn) => {
		remove: () => void
	}
}>({
	connected: false,
	messages: [],
	addMessageListener: () => ({
		remove: () => undefined,
	}),
	connectionFailed: false,
})

export type MessageListenerFn = (
	message: Static<typeof HelloMessage>,
) => unknown

export const Provider = ({ children }: { children: ComponentChildren }) => {
	const [device, setDevice] = useState<Device | undefined>(undefined)
	const [type, setType] = useState<string | undefined>(undefined)
	const [connected, setConnected] = useState<boolean>(false)
	const [connectionFailed, setConnectionFailed] = useState<boolean>(false)
	const [messages, setMessages] = useState<Messages>([])
	const { fingerprint } = useFingerprint()
	const { onParameters } = useParameters()
	const { DKs } = useDKs()

	const listeners = useRef<MessageListenerFn[]>([])

	// Set up websocket connection
	useEffect(() => {
		if (fingerprint === null) return

		let ws: WebSocket | undefined = undefined
		let pingInterval: NodeJS.Timeout

		onParameters(({ webSocketURI }) => {
			const deviceURI = `${webSocketURI}?fingerprint=${fingerprint}`
			console.debug(`[WS]`, 'connecting', deviceURI)
			ws = new WebSocket(deviceURI)

			ws.addEventListener('open', () => {
				console.debug(`[WS]`, 'connected')
				setConnected(true)
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

			ws.addEventListener('close', () => {
				// This happens automatically after 2 hours
				// See https://docs.aws.amazon.com/apigateway/latest/developerguide/limits.html#apigateway-execution-service-websocket-limits-table
				console.debug(`[WS]`, 'disconnected')
				setConnected(false)
			})

			ws.addEventListener('error', (err) => {
				console.error(`[WS]`, err)
				setConnectionFailed(true)
			})
			ws.addEventListener('message', (msg) => {
				let message: any
				try {
					message = JSON.parse(msg.data)
					const maybeValid = validPassthrough(message, (message, errors) => {
						console.error(`[WS]`, `message dropped`, message, errors)
					})
					if (maybeValid !== null) {
						console.debug(`[WS]`, maybeValid)
						setMessages((m) =>
							[{ received: new Date(), message: maybeValid }, ...m].slice(0, 9),
						)
						if (isDeviceIdentity(maybeValid)) {
							const type = DKs[maybeValid.model] as DK
							setDevice({
								id: maybeValid.id,
								lastSeen:
									maybeValid.lastSeen !== undefined
										? new Date(maybeValid.lastSeen)
										: undefined,
								type,
							})
							setType(maybeValid.model)
						}
						listeners.current.map((listener) => listener(message))
					}
				} catch (err) {
					console.error(`[WS]`, `Failed to parse message as JSON`, msg.data)
					return
				}
			})
		})

		return () => {
			ws?.close()
			setConnected(false)
			pingInterval !== undefined && clearInterval(pingInterval)
		}
	}, [fingerprint])

	return (
		<DeviceContext.Provider
			value={{
				device,
				type: type === undefined ? undefined : DKs[type],
				connected,
				messages,
				addMessageListener: (fn) => {
					listeners.current.push(fn)
					return {
						remove: () => {
							listeners.current = listeners.current.filter((f) => f !== fn)
						},
					}
				},
				connectionFailed,
			}}
		>
			{children}
		</DeviceContext.Provider>
	)
}

export const Consumer = DeviceContext.Consumer

export const useDevice = () => useContext(DeviceContext)

const isDeviceIdentity = (
	message: Static<typeof HelloMessage>,
): message is Static<typeof DeviceIdentity> =>
	message['@context'] === Context.deviceIdentity.toString()
