import {
	Context,
	DeviceIdentity,
	MuninnMessage,
	validPassthrough,
} from '@bifravst/muninn-proto/Muninn'
import { type Static } from '@sinclair/typebox'
import { createContext, type ComponentChildren } from 'preact'
import { useContext, useEffect, useRef, useState } from 'preact/hooks'
import { useCode } from './Code.js'
import { useParameters } from './Parameters.js'

export type DK = {
	model: string
	title: string
	html: string
	links: {
		learnMore: string
		documentation: string
	}
}

export type Device = {
	imei: string
	code: string
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
	fromCode: (code: string) => void
	DKs: Record<string, DK>
	connected: boolean
	messages: Messages
	addMessageListener: (listener: MessageListenerFn) => void
	removeMessageListener: (listener: MessageListenerFn) => void
}>({
	fromCode: () => undefined,
	DKs: {},
	connected: false,
	messages: [],
	addMessageListener: () => undefined,
	removeMessageListener: () => undefined,
})

export type MessageListenerFn = (
	message: Static<typeof MuninnMessage>,
) => unknown

export const Provider = ({
	children,
	DKs,
}: {
	children: ComponentChildren
	DKs: Record<string, DK>
}) => {
	const [device, setDevice] = useState<Device | undefined>(undefined)
	const [type, setType] = useState<string | undefined>(undefined)
	const [connected, setConnected] = useState<boolean>(false)
	const [messages, setMessages] = useState<Messages>([])
	const { code, set } = useCode()
	const { webSocketURI } = useParameters()
	const listeners = useRef<MessageListenerFn[]>([])

	console.debug(`[Device]`, device)

	// Set up websocket connection
	useEffect(() => {
		console.log({ webSocketURI, code })
		if (code === null) return
		if (webSocketURI === undefined) return
		const deviceURI = `${webSocketURI}?code=${code}`
		console.debug(`[WS]`, 'connecting', deviceURI)
		const ws = new WebSocket(deviceURI)

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
							code,
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

		return () => {
			ws.close()
			setConnected(false)
		}
	}, [code, webSocketURI])

	return (
		<DeviceContext.Provider
			value={{
				fromCode: (code) => {
					set(code)
				},
				device,
				type: type === undefined ? undefined : DKs[type],
				DKs,
				connected,
				messages,
				addMessageListener: (fn) => {
					listeners.current.push(fn)
				},
				removeMessageListener: (fn) => {
					listeners.current = listeners.current.filter((f) => f !== fn)
				},
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
