import {
	Battery,
	Context,
	Gain,
	HelloMessage,
} from '@hello.nrfcloud.com/proto/hello'
import { type Static } from '@sinclair/typebox'
import { createContext, type ComponentChildren } from 'preact'
import { useContext, useEffect, useState } from 'preact/hooks'
import { useDevice, type MessageListenerFn } from '../Device.js'

const solarThingy = Context.model('PCA20035+solar')

export const isGain = (
	message: Static<typeof HelloMessage>,
): message is Static<typeof Gain> =>
	message['@context'] === solarThingy.transformed('gain').toString()

export const isBattery = (
	message: Static<typeof HelloMessage>,
): message is Static<typeof Battery> =>
	message['@context'] === solarThingy.transformed('battery').toString()

export const SolarThingyHistoryContext = createContext<{
	gain: { mA: number; ts: number }[]
	battery: { '%': number; ts: number }[]
}>({
	gain: [],
	battery: [],
})

export const Provider = ({ children }: { children: ComponentChildren }) => {
	const { addMessageListener } = useDevice()

	const [gain, setGain] = useState<{ mA: number; ts: number }[]>([])
	const [battery, setBattery] = useState<{ '%': number; ts: number }[]>([])

	const onMessage: MessageListenerFn = (message) => {
		if (isGain(message)) {
			setGain((g) => [message, ...g].sort(({ ts: t1 }, { ts: t2 }) => t2 - t1))
		}
		if (isBattery(message)) {
			setBattery((b) =>
				[message, ...b].sort(({ ts: t1 }, { ts: t2 }) => t2 - t1),
			)
		}
	}

	useEffect(() => {
		const { remove } = addMessageListener(onMessage)

		return () => {
			remove()
		}
	}, [])

	return (
		<SolarThingyHistoryContext.Provider
			value={{
				gain,
				battery,
			}}
		>
			{children}
		</SolarThingyHistoryContext.Provider>
	)
}

export const Consumer = SolarThingyHistoryContext.Consumer

export const useSolarThingyHistory = () => useContext(SolarThingyHistoryContext)
