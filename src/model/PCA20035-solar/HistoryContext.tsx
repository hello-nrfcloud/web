import { TimeSpan } from '#api/api.js'
import { getObjectHistory } from '#api/getObjectHistory.js'
import { useDevice, type ListenerFn } from '#context/Device.js'
import { useFingerprint } from '#context/Fingerprint.js'
import { useParameters } from '#context/Parameters.js'
import { byTs } from '#utils/byTs.js'
import {
	isBatteryAndPower,
	isSolarCharge,
	isTime,
	timeToDate,
	toBatteryAndPower,
	toSolarCharge,
	type BatteryAndPower,
	type SolarCharge,
} from '#proto/lwm2m.js'
import { LwM2MObjectID } from '@hello.nrfcloud.com/proto-map/lwm2m'
import { isNumber, isObject } from 'lodash-es'
import { createContext, type ComponentChildren } from 'preact'
import { useContext, useEffect, useState } from 'preact/hooks'

export type BatteryReading = BatteryAndPower
export type BatteryReadings = Array<BatteryReading>
export type GainReading = SolarCharge
export type GainReadings = Array<GainReading>

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

export const Provider = ({ children }: { children: ComponentChildren }) => {
	const { onReported, device } = useDevice()
	const { fingerprint } = useFingerprint()
	const [timeSpan, setTimeSpan] = useState<TimeSpan>(TimeSpan.lastHour)
	const { onParameters } = useParameters()

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
		if (device === undefined) return
		if (fingerprint === null) return

		onParameters(({ helloApiURL }) => {
			const g = getObjectHistory(helloApiURL, device, fingerprint)
			g(LwM2MObjectID.SolarCharge_14210, timeSpan).ok(
				({ partialInstances }) => {
					setGain(
						partialInstances
							.filter(isGain)
							.map(({ '0': mA, '99': ts }) => ({
								mA,
								ts: timeToDate(ts),
							}))
							.sort(byTs),
					)
				},
			)
			g(LwM2MObjectID.BatteryAndPower_14202, timeSpan).ok(
				({ partialInstances }) => {
					setBattery(
						partialInstances
							.filter(isBattery)
							.map(({ '0': SoC, '99': ts }) => ({
								'%': SoC,
								ts: timeToDate(ts),
							}))
							.sort(byTs),
					)
				},
			)
		})

		return () => {
			remove()
		}
	}, [timeSpan])

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

const isGain = (o: unknown): o is { 0: number; 99: number } =>
	isObject(o) && '0' in o && isNumber(o['0']) && '99' in o && isTime(o['99'])

const isBattery = (o: unknown): o is { 0: number; 99: number } =>
	isObject(o) && '0' in o && isNumber(o['0']) && '99' in o && isTime(o['99'])

export const Consumer = HistoryContext.Consumer

export const useHistory = () => useContext(HistoryContext)
