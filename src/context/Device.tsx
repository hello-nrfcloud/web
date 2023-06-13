import {
	Context,
	DeviceIdentity,
	MuninnMessage,
	validPassthrough,
} from '@bifravst/muninn-proto/Muninn'
import { type Static } from '@sinclair/typebox'
import { createContext, type ComponentChildren } from 'preact'
import { useContext, useEffect, useRef, useState } from 'preact/hooks'
import { useDKs, type DK } from './DKs.js'
import { useFingerprint } from './Fingerprint.js'
import { useParameters } from './Parameters.js'

export type Device = {
	imei: string
	hasLocation: boolean
	type: DK
}

type Messages = {
	received: Date
	message: Static<typeof MuninnMessage>
}[]

export const DeviceContext = createContext<{
	type?: DK | undefined
	device?: Device | undefined
	connected: boolean
	connectionFailed: boolean
	messages: Messages
	addMessageListener: (listener: MessageListenerFn) => void
	removeMessageListener: (listener: MessageListenerFn) => void
}>({
	connected: false,
	messages: [],
	addMessageListener: () => undefined,
	removeMessageListener: () => undefined,
	connectionFailed: false,
})

export type MessageListenerFn = (
	message: Static<typeof MuninnMessage>,
) => unknown

export const Provider = ({ children }: { children: ComponentChildren }) => {
	const [device, setDevice] = useState<Device | undefined>(undefined)
	const [type, setType] = useState<string | undefined>(undefined)
	const [connected, setConnected] = useState<boolean>(false)
	const [connectionFailed, setConnectionFailed] = useState<boolean>(false)
	const [messages, setMessages] = useState<Messages>([])
	const { fingerprint } = useFingerprint()
	const { onParameters } = useParameters()
	const listeners = useRef<MessageListenerFn[]>([])
	const { DKs } = useDKs()

	console.debug(`[Device]`, device)

	// Set up websocket connection
	useEffect(() => {
		if (fingerprint === null) return

		let ws: WebSocket | undefined = undefined

		onParameters(({ webSocketURI }) => {
			console.log({ webSocketURI, fingerprint })
			const deviceURI = `${webSocketURI}?fingerprint=${fingerprint}`
			console.debug(`[WS]`, 'connecting', deviceURI)
			ws = new WebSocket(deviceURI)

			ws.addEventListener('open', () => {
				console.debug(`[WS]`, 'connected')
				setConnected(true)
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
								hasLocation: false,
								imei: maybeValid.id,
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
				},
				removeMessageListener: (fn) => {
					listeners.current = listeners.current.filter((f) => f !== fn)
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
	message: Static<typeof MuninnMessage>,
): message is Static<typeof DeviceIdentity> =>
	message['@context'] === Context.deviceIdentity.toString()
