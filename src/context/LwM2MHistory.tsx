import { TimeSpan } from '#api/api.js'
import {
	isBatteryAndPower,
	isButtonPress,
	isEnvironment,
	isSolarCharge,
	toBattery,
	toButton,
	toEnvironment,
	toSolarCharge,
	type Battery,
	type ButtonPress,
	type Environment,
	type SolarCharge,
} from '#proto/lwm2m.js'
import { createContext, type ComponentChildren } from 'preact'
import { useContext, useEffect, useState } from 'preact/hooks'
import { useDevice, type MessageListenerFn } from '#context/Device.js'
import { byTs } from '#context/byTs.js'

type FromHistory = {
	fromHistory?: boolean
}
export type BatteryReading = Battery & FromHistory
export type BatteryReadings = BatteryReading[]
export type GainReading = SolarCharge & FromHistory
export type GainReadings = GainReading[]

export const LwM2MHistoryContext = createContext<{
	battery: BatteryReadings
	gain: GainReadings
	environment: Environment[]
	button: ButtonPress[]
	timeSpan: TimeSpan
	setTimeSpan: (type: TimeSpan) => void
}>({
	battery: [],
	gain: [],
	environment: [],
	button: [],
	timeSpan: TimeSpan.lastHour,
	setTimeSpan: () => undefined,
})

// FIXME: Add Gain and Battery history
export const Provider = ({ children }: { children: ComponentChildren }) => {
	const { addMessageListener } = useDevice()
	const [timeSpan, setTimeSpan] = useState<TimeSpan>(TimeSpan.lastHour)

	const [battery, setBattery] = useState<BatteryReadings>([])
	const [gain, setGain] = useState<GainReadings>([])
	const [environment, setEnvironment] = useState<Array<Environment>>([])
	const [button, setButton] = useState<Array<ButtonPress>>([])

	const onMessage: MessageListenerFn = (message) => {
		if (isBatteryAndPower(message)) {
			setBattery((b) => [toBattery(message), ...b].sort(byTs))
		}
		if (isSolarCharge(message)) {
			setGain((b) => [toSolarCharge(message), ...b].sort(byTs))
		}
		if (isEnvironment(message)) {
			setEnvironment((m) => [toEnvironment(message), ...m].sort(byTs))
		}
		if (isButtonPress(message)) {
			setButton((m) => [toButton(message), ...m].sort(byTs))
		}
	}

	useEffect(() => {
		const { remove } = addMessageListener(onMessage)

		return () => {
			remove()
		}
	}, [])

	return (
		<LwM2MHistoryContext.Provider
			value={{
				battery,
				gain,
				environment,
				button,
				timeSpan,
				setTimeSpan,
			}}
		>
			{children}
		</LwM2MHistoryContext.Provider>
	)
}

export const Consumer = LwM2MHistoryContext.Consumer

export const useLwM2MHistory = () => useContext(LwM2MHistoryContext)

export const isNotHistory = ({ fromHistory }: FromHistory) =>
	fromHistory !== true

export const isHistory = ({ fromHistory }: FromHistory) => fromHistory === true
