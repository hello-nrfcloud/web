import { TimeSpan } from '#api/api.js'
import { useDevice, type ListenerFn } from '#context/Device.js'
import { byTs } from '#context/byTs.js'
import {
	isBatteryAndPower,
	isSolarCharge,
	toBatteryAndPower,
	toSolarCharge,
	type BatteryAndPower,
	type SolarCharge,
} from '#proto/lwm2m.js'
import { createContext, type ComponentChildren } from 'preact'
import { useContext, useEffect, useState } from 'preact/hooks'

export type BatteryReading = BatteryAndPower
export type BatteryReadings = BatteryReading[]
export type GainReading = SolarCharge
export type GainReadings = GainReading[]

export const HistoryContext = createContext<{
	battery: BatteryReadings
	gain: GainReadings
	timeSpan: TimeSpan
	setTimeSpan: (type: TimeSpan) => void
}>({
	battery: [],
	gain: [],
	timeSpan: TimeSpan.lastHour,
	setTimeSpan: () => undefined,
})

// FIXME: Add Gain and Battery history
export const Provider = ({ children }: { children: ComponentChildren }) => {
	const { onReported } = useDevice()
	const [timeSpan, setTimeSpan] = useState<TimeSpan>(TimeSpan.lastHour)

	const [battery, setBattery] = useState<BatteryReadings>([])
	const [gain, setGain] = useState<GainReadings>([])

	const listener: ListenerFn = (instance) => {
		if (isBatteryAndPower(instance)) {
			setBattery((b) => [toBatteryAndPower(instance), ...b].sort(byTs))
		}
		if (isSolarCharge(instance)) {
			setGain((b) => [toSolarCharge(instance), ...b].sort(byTs))
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
