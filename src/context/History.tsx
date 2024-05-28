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
import { useDevice, type ListenerFn } from '#context/Device.js'
import { byTs } from '#context/byTs.js'

export type BatteryReading = Battery
export type BatteryReadings = BatteryReading[]
export type GainReading = SolarCharge
export type GainReadings = GainReading[]

export const HistoryContext = createContext<{
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
	const { onReported } = useDevice()
	const [timeSpan, setTimeSpan] = useState<TimeSpan>(TimeSpan.lastHour)

	const [battery, setBattery] = useState<BatteryReadings>([])
	const [gain, setGain] = useState<GainReadings>([])
	const [environment, setEnvironment] = useState<Array<Environment>>([])
	const [button, setButton] = useState<Array<ButtonPress>>([])

	const listener: ListenerFn = (instance) => {
		if (isBatteryAndPower(instance)) {
			setBattery((b) => [toBattery(instance), ...b].sort(byTs))
		}
		if (isSolarCharge(instance)) {
			setGain((b) => [toSolarCharge(instance), ...b].sort(byTs))
		}
		if (isEnvironment(instance)) {
			setEnvironment((m) => [toEnvironment(instance), ...m].sort(byTs))
		}
		if (isButtonPress(instance)) {
			setButton((m) => [toButton(instance), ...m].sort(byTs))
		}
	}

	useEffect(() => {
		const { remove } = onReported(listener)

		return () => {
			remove()
		}
	}, [])

	return (
		<HistoryContext.Provider
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
		</HistoryContext.Provider>
	)
}

export const Consumer = HistoryContext.Consumer

export const useHistory = () => useContext(HistoryContext)
