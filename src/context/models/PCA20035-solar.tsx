import {
	AirHumidity,
	AirPressure,
	AirQuality,
	AirTemperature,
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

const isGain = (
	message: Static<typeof HelloMessage>,
): message is Static<typeof Gain> =>
	message['@context'] === solarThingy.transformed('gain').toString()

const isBattery = (
	message: Static<typeof HelloMessage>,
): message is Static<typeof Battery> =>
	message['@context'] === solarThingy.transformed('battery').toString()
const isAirHumidity = (
	message: Static<typeof HelloMessage>,
): message is Static<typeof AirHumidity> =>
	message['@context'] === solarThingy.transformed('airHumidity').toString()
const isAirPressure = (
	message: Static<typeof HelloMessage>,
): message is Static<typeof AirPressure> =>
	message['@context'] === solarThingy.transformed('airPressure').toString()
const isAirQuality = (
	message: Static<typeof HelloMessage>,
): message is Static<typeof AirQuality> =>
	message['@context'] === solarThingy.transformed('airQuality').toString()
const isAirTemperature = (
	message: Static<typeof HelloMessage>,
): message is Static<typeof AirTemperature> =>
	message['@context'] === solarThingy.transformed('airTemperature').toString()

export const SolarThingyHistoryContext = createContext<{
	gain: Static<typeof Gain>[]
	battery: Static<typeof Battery>[]
	airHumidity: Static<typeof AirHumidity>[]
	airPressure: Static<typeof AirPressure>[]
	airQuality: Static<typeof AirQuality>[]
	airTemperature: Static<typeof AirTemperature>[]
}>({
	gain: [],
	battery: [],
	airHumidity: [],
	airPressure: [],
	airQuality: [],
	airTemperature: [],
})

const byTs = ({ ts: t1 }: { ts: number }, { ts: t2 }: { ts: number }) => t2 - t1

export const Provider = ({ children }: { children: ComponentChildren }) => {
	const { addMessageListener } = useDevice()

	const [gain, setGain] = useState<Static<typeof Gain>[]>([])
	const [battery, setBattery] = useState<Static<typeof Battery>[]>([])
	const [airPressure, setAirPressure] = useState<Static<typeof AirPressure>[]>(
		[],
	)
	const [airQuality, setAirQuality] = useState<Static<typeof AirQuality>[]>([])
	const [airHumidity, setAirHumidity] = useState<Static<typeof AirHumidity>[]>(
		[],
	)
	const [airTemperature, setAirTemperature] = useState<
		Static<typeof AirTemperature>[]
	>([])

	const onMessage: MessageListenerFn = (message) => {
		if (isGain(message)) {
			setGain((g) => [message, ...g].sort(byTs))
		}
		if (isBattery(message)) {
			setBattery((b) => [message, ...b].sort(byTs))
		}
		if (isAirHumidity(message)) {
			setAirHumidity((m) => [message, ...m].sort(byTs))
		}
		if (isAirPressure(message)) {
			setAirPressure((m) => [message, ...m].sort(byTs))
		}
		if (isAirQuality(message)) {
			setAirQuality((m) => [message, ...m].sort(byTs))
		}
		if (isAirTemperature(message)) {
			setAirTemperature((m) => [message, ...m].sort(byTs))
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
				airHumidity,
				airPressure,
				airQuality,
				airTemperature,
			}}
		>
			{children}
		</SolarThingyHistoryContext.Provider>
	)
}

export const Consumer = SolarThingyHistoryContext.Consumer

export const useSolarThingyHistory = () => useContext(SolarThingyHistoryContext)
