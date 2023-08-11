import {
	AirHumidity,
	AirPressure,
	AirQuality,
	AirTemperature,
	Battery,
	Button,
	Gain,
} from '@hello.nrfcloud.com/proto/hello/model/PCA20035+solar'
import {
	TimeSpan,
	GainResponse,
	BatteryResponse,
	CommonResponse,
	GainRequest,
	BatteryRequest,
} from '@hello.nrfcloud.com/proto/hello/history'
import { Context } from '@hello.nrfcloud.com/proto/hello'
import { type Static } from '@sinclair/typebox'
import { createContext, type ComponentChildren } from 'preact'
import { useContext, useEffect, useState } from 'preact/hooks'
import { useDevice, type MessageListenerFn } from '../Device.js'
import { generateUUID } from '#utils/generateUUID.js'
import type { IncomingMessageType } from '#proto/proto.js'
import { byTs } from '../byTs.js'

const solarThingy = Context.model('PCA20035+solar')

const isGain = (message: IncomingMessageType): message is Static<typeof Gain> =>
	message['@context'] === solarThingy.transformed('gain').toString()
const isGainHistory = (
	message: IncomingMessageType,
): message is Static<typeof GainResponse> =>
	message['@context'] === Context.historicalDataResponse.toString() &&
	(message as Static<typeof CommonResponse>).message === 'gain'

const isBattery = (
	message: IncomingMessageType,
): message is Static<typeof Battery> =>
	message['@context'] === solarThingy.transformed('battery').toString()
const isBatteryHistory = (
	message: IncomingMessageType,
): message is Static<typeof BatteryResponse> =>
	message['@context'] === Context.historicalDataResponse.toString() &&
	(message as Static<typeof BatteryResponse>).message === 'battery'

const isAirHumidity = (
	message: IncomingMessageType,
): message is Static<typeof AirHumidity> =>
	message['@context'] === solarThingy.transformed('airHumidity').toString()
const isAirPressure = (
	message: IncomingMessageType,
): message is Static<typeof AirPressure> =>
	message['@context'] === solarThingy.transformed('airPressure').toString()
const isAirQuality = (
	message: IncomingMessageType,
): message is Static<typeof AirQuality> =>
	message['@context'] === solarThingy.transformed('airQuality').toString()
const isAirTemperature = (
	message: IncomingMessageType,
): message is Static<typeof AirTemperature> =>
	message['@context'] === solarThingy.transformed('airTemperature').toString()
const isButton = (
	message: IncomingMessageType,
): message is Static<typeof Button> =>
	message['@context'] === solarThingy.transformed('button').toString()

type FromHistory = {
	fromHistory?: boolean
}
export type GainReading = Omit<Static<typeof Gain>, '@context'> & FromHistory
export type GainReadings = GainReading[]

export type BatteryReading = Omit<Static<typeof Battery>, '@context'> &
	FromHistory
export type BatteryReadings = BatteryReading[]

export const SolarThingyHistoryContext = createContext<{
	gain: GainReadings
	battery: BatteryReadings
	airHumidity: Omit<Static<typeof AirHumidity>, '@context'>[]
	airPressure: Omit<Static<typeof AirPressure>, '@context'>[]
	airQuality: Omit<Static<typeof AirQuality>, '@context'>[]
	airTemperature: Omit<Static<typeof AirTemperature>, '@context'>[]
	button: Omit<Static<typeof Button>, '@context'>[]
	timeSpan: Static<typeof TimeSpan>
	setTimeSpan: (type: Static<typeof TimeSpan>) => void
}>({
	gain: [],
	battery: [],
	airHumidity: [],
	airPressure: [],
	airQuality: [],
	airTemperature: [],
	button: [],
	timeSpan: 'lastHour',
	setTimeSpan: () => undefined,
})

export default ({ children }: { children: ComponentChildren }) => {
	const { addMessageListener, send } = useDevice()
	const [timeSpan, setTimeSpan] = useState<Static<typeof TimeSpan>>('lastHour')

	const [gain, setGain] = useState<GainReadings>([])
	const [battery, setBattery] = useState<BatteryReadings>([])
	const [airPressure, setAirPressure] = useState<
		Omit<Static<typeof AirPressure>, '@context'>[]
	>([])
	const [airQuality, setAirQuality] = useState<Static<typeof AirQuality>[]>([])
	const [airHumidity, setAirHumidity] = useState<Static<typeof AirHumidity>[]>(
		[],
	)
	const [airTemperature, setAirTemperature] = useState<
		Static<typeof AirTemperature>[]
	>([])
	const [button, setButton] = useState<Static<typeof Button>[]>([])

	useEffect(() => {
		if (send === undefined) return
		console.log(`[History]`, `Requesting gain history`)
		const gainHistory: Static<typeof GainRequest> = {
			'@context': Context.historicalDataRequest.toString(),
			'@id': generateUUID(),
			type: timeSpan,
			message: 'gain',
			attributes: {
				avgMA: { attribute: 'mA', aggregate: 'avg' },
			},
		}
		send(gainHistory)

		console.log(`[History]`, `Requesting battery history`)
		const batteryHistory: Static<typeof BatteryRequest> = {
			'@context': Context.historicalDataRequest.toString(),
			'@id': generateUUID(),
			type: timeSpan,
			message: 'battery',
			attributes: {
				avgPercent: { attribute: '%', aggregate: 'avg' },
			},
		}
		send(batteryHistory)
	}, [send, timeSpan])

	const onMessage: MessageListenerFn = (message) => {
		if (isGain(message)) {
			setGain((g) => [message, ...g].sort(byTs))
		}
		if (isGainHistory(message)) {
			setGain((currentGain) =>
				[
					...currentGain.filter(({ fromHistory }) => fromHistory !== true),
					...(message.attributes['avgMA'] ?? []).map((m: GainReading) => ({
						...m,
						fromHistory: true,
					})), // mark as from history
				].sort(byTs),
			)
		}
		if (isBattery(message)) {
			setBattery((b) => [message, ...b].sort(byTs))
		}
		if (isBatteryHistory(message)) {
			setBattery((currentBattery) =>
				[
					...currentBattery.filter(({ fromHistory }) => fromHistory !== true),
					...(message.attributes['avgPercent'] ?? []).map(
						(m: BatteryReading) => ({
							...m,
							fromHistory: true,
						}),
					), // mark as from history
				].sort(byTs),
			)
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
		if (isButton(message)) {
			setButton((m) => [message, ...m].sort(byTs))
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
				button,
				timeSpan,
				setTimeSpan,
			}}
		>
			{children}
		</SolarThingyHistoryContext.Provider>
	)
}

export const Consumer = SolarThingyHistoryContext.Consumer

export const useSolarThingyHistory = () => useContext(SolarThingyHistoryContext)
