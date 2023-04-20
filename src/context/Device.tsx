import { createContext, type ComponentChildren } from 'preact'
import { useContext, useEffect, useState } from 'preact/hooks'
import { useCode } from './Code'
import { useParameters } from './Parameters'

export type DK = {
	model: string
	title: string
	html: string
	tags: string[]
	learnMoreLink: string
}

export type Device = {
	imei: string
	code: string
	hasLocation: boolean
	type: DK
}

export const DeviceContext = createContext<{
	type?: DK | undefined
	device?: Device | undefined
	fromCode: (code: string) => void
	DKs: Record<string, DK>
	connected: boolean
	messages: Record<string, any>[]
}>({
	fromCode: () => undefined,
	DKs: {},
	connected: false,
	messages: [],
})

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
	const [messages, setMessages] = useState<Record<string, any>[]>([])
	const { code, set } = useCode()
	const { webSocketURI } = useParameters()

	console.debug(`[Device]`, device)

	useEffect(() => {
		if (device?.imei === undefined) return
		const t = setTimeout(() => {
			setDevice((d) => ({
				...(d as Device),
				hasLocation: true,
			}))
		}, 10000)
		return () => clearTimeout(t)
	}, [device])

	useEffect(() => {
		if (code === null) return
		setDevice({
			hasLocation: false,
			code,
			imei: '351234567890123',
			type: DKs['PCA10090'] as DK,
		})
		setType('PCA10090')
	}, [code])

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
				console.debug(`[WS]`, message)
				setMessages((m) => [message, ...m].slice(0, 9))
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
			}}
		>
			{children}
		</DeviceContext.Provider>
	)
}

export const Consumer = DeviceContext.Consumer

export const useDevice = () => useContext(DeviceContext)
