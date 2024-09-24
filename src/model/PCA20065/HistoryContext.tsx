import { useDevice, type ListenerFn } from '#context/Device.js'
import { useFingerprint } from '#context/Fingerprint.js'
import { useHistoryChart } from '#context/HistoryChart.js'
import { useParameters } from '#context/Parameters.js'
import {
	isBatteryAndPower,
	isTime,
	timeToDate,
	toBatteryAndPower,
	type BatteryAndPower,
	type Reboot,
} from '#proto/lwm2m.js'
import { byTs } from '#utils/byTs.js'
import { LwM2MObjectID } from '@hello.nrfcloud.com/proto-map/lwm2m'
import { isNumber, isObject } from 'lodash-es'
import { createContext, type ComponentChildren } from 'preact'
import { useContext, useEffect, useState } from 'preact/hooks'
import { getObjectHistory } from '../../api/getObjectHistory.js'

type BatteryReadings = Array<BatteryAndPower>
type Reboots = Array<Reboot>

export const HistoryContext = createContext<{
	battery: BatteryReadings
	reboots: Reboots
}>({
	battery: [],
	reboots: [],
})

const isBattery = (o: unknown): o is { 0: number; 99: number } =>
	isObject(o) && '0' in o && isNumber(o['0']) && '99' in o && isTime(o['99'])

const isReboot = (
	o: unknown,
): o is { 99: number; 0: number } | { 99: number } =>
	isObject(o) &&
	(('0' in o && isNumber(o['0'])) || true) &&
	'99' in o &&
	isTime(o['99'])

export const Provider = ({ children }: { children: ComponentChildren }) => {
	const { onReported, device } = useDevice()
	const { fingerprint } = useFingerprint()
	const { onParameters } = useParameters()
	const { timeSpan } = useHistoryChart()

	const [battery, setBattery] = useState<BatteryReadings>([])
	const [reboots, setReboots] = useState<Reboots>([])

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
			// Fetch state of charge history
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
			// Fetch reboots
			g(LwM2MObjectID.Reboot_14250, timeSpan).ok(({ partialInstances }) => {
				setReboots(
					partialInstances
						.filter(isReboot)
						.map((i) => ({
							reason: '0' in i ? i['0'] : undefined,
							ts: timeToDate(i['99']),
						}))
						.sort(byTs),
				)
			})
		})

		return () => {
			remove()
		}
	}, [timeSpan])

	return (
		<HistoryContext.Provider
			value={{
				battery,
				reboots,
			}}
		>
			{children}
		</HistoryContext.Provider>
	)
}

export const Consumer = HistoryContext.Consumer

export const useHistory = () => useContext(HistoryContext)
