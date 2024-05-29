import { TimeSpan } from '#api/api.js'
import { useDevice, type Device, type ListenerFn } from '#context/Device.js'
import { useParameters } from '#context/Parameters.js'
import { byTs } from '#context/byTs.js'
import {
	isBatteryAndPower,
	isSolarCharge,
	toBatteryAndPower,
	toSolarCharge,
	type BatteryAndPower,
	type SolarCharge,
} from '#proto/lwm2m.js'
import { validatingFetch } from '#utils/validatingFetch.js'
import { createContext, type ComponentChildren } from 'preact'
import { useContext, useEffect, useState } from 'preact/hooks'
import { LwM2MObjectHistory } from '@hello.nrfcloud.com/proto/hello'
import { useFingerprint } from '#context/Fingerprint.js'
import { LwM2MObjectID } from '@hello.nrfcloud.com/proto-map/lwm2m'
import { isNumber, isObject } from 'lodash-es'

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

// FIXME: Add Gain and Battery history
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
			console.log('helloApiURL', helloApiURL)
			g(LwM2MObjectID.SolarCharge_14210, timeSpan).ok(
				({ partialInstances }) => {
					setGain((g) =>
						[
							...g,
							...partialInstances
								.filter(isGain)
								.map(({ '0': mA, '99': ts }) => ({
									mA,
									ts,
								})),
						].sort(byTs),
					)
				},
			)
			g(LwM2MObjectID.BatteryAndPower_14202, timeSpan).ok(
				({ partialInstances }) => {
					setBattery((g) =>
						[
							...g,
							...partialInstances
								.filter(isBattery)
								.map(({ '0': SoC, '99': ts }) => ({
									'%': SoC,
									ts,
								})),
						].sort(byTs),
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
	isObject(o) && '0' in o && isNumber(o['0']) && '99' in o && isNumber(o['99'])

const isBattery = (o: unknown): o is { 0: number; 99: number } =>
	isObject(o) && '0' in o && isNumber(o['0']) && '99' in o && isNumber(o['99'])

export const Consumer = HistoryContext.Consumer

export const useHistory = () => useContext(HistoryContext)

const getObjectHistory =
	(helloApiURL: URL, device: Device, fingerprint: string) =>
	(ObjectID: LwM2MObjectID, timeSpan: TimeSpan) =>
		validatingFetch(LwM2MObjectHistory)(
			new URL(
				`./device/${device.id}/history/${ObjectID}/0?${new URLSearchParams({
					fingerprint,
					timeSpan,
				}).toString()}`,
				helloApiURL,
			),
		)
