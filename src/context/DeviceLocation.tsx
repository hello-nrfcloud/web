import type { TimeSpan } from '#api/api.js'
import { useDevice, type ListenerFn } from '#context/Device.js'
import {
	toLocationSource,
	type LocationSource,
} from '#map/LocationSourceLabels.js'
import {
	isGeolocation,
	timeToDate,
	toGeoLocation,
	type GeoLocation,
} from '#proto/lwm2m.js'
import {
	LwM2MObjectID,
	type Geolocation_14201,
	type LwM2MObjectInstance,
} from '@hello.nrfcloud.com/proto-map/lwm2m'
import { isEqual } from 'lodash-es'
import { createContext, type ComponentChildren } from 'preact'
import { useContext, useEffect, useState } from 'preact/hooks'
import { useParameters } from './Parameters.js'
import { useFingerprint } from './Fingerprint.js'
import { getObjectHistory } from '#api/getObjectHistory.js'

export type Locations = Partial<
	Record<keyof typeof LocationSource, GeoLocation>
>

export type TrailPoint = GeoLocation & { id: string }

export const DeviceLocationContext = createContext<{
	locations: Locations
	timeSpan?: TimeSpan
	setTimeSpan: (type?: TimeSpan) => void
	trail: TrailPoint[]
	enableClustering: (clustering: boolean) => void
	clustering: boolean
}>({
	locations: {},
	setTimeSpan: () => undefined,
	trail: [],
	enableClustering: () => undefined,
	clustering: false,
})

export const Provider = ({ children }: { children: ComponentChildren }) => {
	const { onReported, device, reported } = useDevice()
	const [timeSpan, setTimeSpan] = useState<TimeSpan | undefined>()
	const [clustering, setClustering] = useState<boolean>(false)
	const [locations, setLocations] = useState<Locations>({})
	const [trail, setTrail] = useState<TrailPoint[]>([])
	const { onParameters } = useParameters()
	const { fingerprint } = useFingerprint()

	useEffect(() => {
		if (device === undefined) return
		const listener: ListenerFn = (instance) => {
			if (isGeolocation(instance))
				setLocations((l) => ({
					...l,
					[instance.Resources[6]]: toGeoLocation(instance),
				}))
		}
		const { remove } = onReported(listener)

		return () => {
			remove()
		}
	}, [device])

	useEffect(() => {
		if (reported === undefined) return
		const newLocations = locationsFromReported(reported)
		if (isEqual(newLocations, locations)) return
		setLocations(newLocations)
	}, [reported])

	useEffect(() => {
		if (device === undefined) return
		if (fingerprint === null) return
		if (timeSpan === undefined) {
			setTrail([])
			return
		}

		onParameters(({ helloApiURL }) => {
			const g = getObjectHistory(helloApiURL, device, fingerprint)
			g(
				LwM2MObjectID.Geolocation_14201,
				timeSpan,
				clustering ? new URLSearchParams({ trail: '1' }) : undefined,
			).ok(({ partialInstances }) => {
				setTrail(
					partialInstances.map((instance) => {
						const {
							0: lat,
							1: lng,
							3: acc,
							6: src,
							99: ts,
						} = instance as LwM2MObjectInstance<Geolocation_14201>['Resources']
						return {
							lat,
							lng,
							acc,
							src,
							ts: timeToDate(ts),
							id: `${device.id}-${src}-${ts}`,
						}
					}),
				)
			})
		})
	}, [timeSpan, clustering])

	return (
		<DeviceLocationContext.Provider
			value={{
				locations,
				timeSpan,
				setTimeSpan,
				trail,
				enableClustering: (clustering) => setClustering(clustering),
				clustering,
			}}
		>
			{children}
		</DeviceLocationContext.Provider>
	)
}

export const Consumer = DeviceLocationContext.Consumer

export const useDeviceLocation = () => useContext(DeviceLocationContext)

const locationsFromReported = (
	reported: Record<string, LwM2MObjectInstance>,
): Locations =>
	Object.values(reported).reduce<Locations>((acc, instance) => {
		if (isGeolocation(instance)) {
			acc[toLocationSource(instance.Resources[6])] = toGeoLocation(instance)
		}
		return acc
	}, {})
