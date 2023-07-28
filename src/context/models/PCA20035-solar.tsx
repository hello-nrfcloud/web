import {
	AirHumidity,
	AirPressure,
	AirQuality,
	AirTemperature,
	Battery,
	Button,
	Context,
	Gain,
	HistoricalDataRequest,
	HistoricalDataResponse,
	ChartType,
	HelloMessage,
	GainResponse,
	BatteryResponse,
} from '@hello.nrfcloud.com/proto/hello'
import { type Static } from '@sinclair/typebox'
import { createContext, type ComponentChildren } from 'preact'
import { useContext, useEffect, useState } from 'preact/hooks'
import { useDevice, type MessageListenerFn } from '../Device.js'
import { generateUUID } from '#utils/generateUUID.js'

const solarThingy = Context.model('PCA20035+solar')

const isGain = (
	message: Static<typeof HelloMessage>,
): message is Static<typeof Gain> =>
	message['@context'] === solarThingy.transformed('gain').toString()
const isGainHistory = (
	message: Static<typeof HelloMessage>,
): message is Static<typeof HistoricalDataResponse> =>
	message['@context'] === Context.historicalDataResponse.toString() &&
	(message as Static<typeof HistoricalDataResponse>).message === 'gain'

const isBattery = (
	message: Static<typeof HelloMessage>,
): message is Static<typeof Battery> =>
	message['@context'] === solarThingy.transformed('battery').toString()
const isBatteryHistory = (
	message: Static<typeof HelloMessage>,
): message is Static<typeof HistoricalDataResponse> =>
	message['@context'] === Context.historicalDataResponse.toString() &&
	(message as Static<typeof HistoricalDataResponse>).message === 'battery'

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
const isButton = (
	message: Static<typeof HelloMessage>,
): message is Static<typeof Button> =>
	message['@context'] === solarThingy.transformed('button').toString()

const chartTypes: {
	id: Static<typeof ChartType>
	title: string
}[] = [
	{ id: 'lastHour', title: 'last hour' },
	{ id: 'lastDay', title: 'last day' },
	{ id: 'lastWeek', title: 'last week' },
	{ id: 'lastMonth', title: 'last month' },
]

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
	chartType: Static<typeof ChartType>
	chartTypes: {
		id: Static<typeof ChartType>
		title: string
	}[]
	setChartType: (type: Static<typeof ChartType>) => void
}>({
	gain: [],
	battery: [],
	airHumidity: [],
	airPressure: [],
	airQuality: [],
	airTemperature: [],
	button: [],
	chartType: 'lastHour',
	setChartType: () => undefined,
	chartTypes,
})

const byTs = ({ ts: t1 }: { ts: number }, { ts: t2 }: { ts: number }) => t2 - t1

export const Provider = ({ children }: { children: ComponentChildren }) => {
	const { addMessageListener, send } = useDevice()
	const [chartType, setChartType] =
		useState<Static<typeof ChartType>>('lastHour')

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
		const gainHistory: Static<typeof HistoricalDataRequest> = {
			'@context': Context.historicalDataRequest.toString(),
			'@id': generateUUID(),
			type: chartType,
			message: 'gain',
			attributes: {
				avgMA: { attribute: 'mA', aggregate: 'avg' },
			},
		}
		send(gainHistory)

		console.log(`[History]`, `Requesting battery history`)
		const batteryHistory: Static<typeof HistoricalDataRequest> = {
			'@context': Context.historicalDataRequest.toString(),
			'@id': generateUUID(),
			type: chartType,
			message: 'battery',
			attributes: {
				avgPercent: { attribute: '%', aggregate: 'avg' },
			},
		}
		send(batteryHistory)
	}, [send, chartType])

	const onMessage: MessageListenerFn = (message) => {
		if (isGain(message)) {
			setGain((g) => [message, ...g].sort(byTs))
		}
		if (isGainHistory(message)) {
			setGain((currentGain) =>
				[
					...currentGain.filter(({ fromHistory }) => fromHistory !== true),
					...(
						(message.attributes as Static<typeof GainResponse>)['avgMA'] ?? []
					).map((m) => ({ ...m, fromHistory: true })), // mark as from history
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
					...(
						(message.attributes as Static<typeof BatteryResponse>)[
							'avgPercent'
						] ?? []
					).map((m) => ({ ...m, fromHistory: true })), // mark as from history
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
				chartType,
				chartTypes,
				setChartType,
			}}
		>
			{children}
		</SolarThingyHistoryContext.Provider>
	)
}

export const Consumer = SolarThingyHistoryContext.Consumer

export const useSolarThingyHistory = () => useContext(SolarThingyHistoryContext)
