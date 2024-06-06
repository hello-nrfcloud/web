import { TimeSpan } from '#api/api.js'
import { useDevice, type ListenerFn } from '#context/Device.js'
import { useFingerprint } from '#context/Fingerprint.js'
import { useParameters } from '#context/Parameters.js'
import { byTs } from '#context/byTs.js'
import {
	isBatteryAndPower,
	toBatteryAndPower,
	type BatteryAndPower,
} from '#proto/lwm2m.js'
import { LwM2MObjectID } from '@hello.nrfcloud.com/proto-map/lwm2m'
import { isNumber, isObject, isString } from 'lodash-es'
import { createContext, type ComponentChildren } from 'preact'
import { useContext, useEffect, useState } from 'preact/hooks'
import { getObjectHistory } from '../../api/getObjectHistory.js'

export type BatteryReading = BatteryAndPower
export type BatteryReadings = Array<BatteryReading>

export const HistoryContext = createContext<{
	battery: BatteryReadings
	timeSpan: TimeSpan
	setTimeSpan: (type: TimeSpan) => void
}>({
	battery: [],
	timeSpan: TimeSpan.lastHour,
	setTimeSpan: () => undefined,
})

export const Provider = ({ children }: { children: ComponentChildren }) => {
	const { onReported, device } = useDevice()
	const { fingerprint } = useFingerprint()
	const [timeSpan, setTimeSpan] = useState<TimeSpan>(TimeSpan.lastHour)
	const { onParameters } = useParameters()

	const [battery, setBattery] = useState<BatteryReadings>([])

	const listener: ListenerFn = (instance) => {
		if (isBatteryAndPower(instance)) {
			setBattery((b) => [toBatteryAndPower(instance), ...b].sort(byTs))
		}
	}

	useEffect(() => {
		const { remove } = onReported(listener)
		if (device === undefined) return
		if (fingerprint === null) return

		onParameters(({ helloApiURL }) => {
			const g = getObjectHistory(helloApiURL, device, fingerprint)
			console.log('helloApiURL', helloApiURL)
			g(LwM2MObjectID.BatteryAndPower_14202, timeSpan).ok(
				({ partialInstances }) => {
					setBattery(
						partialInstances
							.filter(isBattery)
							.map(({ '0': SoC, ts }) => ({
								'%': SoC,
								ts: new Date(ts).getTime(),
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
				timeSpan,
				setTimeSpan,
			}}
		>
			{children}
		</HistoryContext.Provider>
	)
}

const isBattery = (o: unknown): o is { 0: number; ts: string } =>
	isObject(o) && '0' in o && isNumber(o['0']) && 'ts' in o && isString(o['ts'])

export const Consumer = HistoryContext.Consumer

export const useHistory = () => useContext(HistoryContext)
