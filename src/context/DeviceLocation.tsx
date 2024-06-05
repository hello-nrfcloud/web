import { TimeSpan } from '#api/api.js'
import { useDevice, type ListenerFn } from '#context/Device.js'
import {
	toLocationSource,
	type LocationSource,
} from '#map/LocationSourceLabels.js'
import { isGeolocation, toGeoLocation, type GeoLocation } from '#proto/lwm2m.js'
import { type LwM2MObjectInstance } from '@hello.nrfcloud.com/proto-map/lwm2m'
import { createContext, type ComponentChildren } from 'preact'
import { useContext, useEffect, useState } from 'preact/hooks'

export type Locations = Partial<
	Record<keyof typeof LocationSource, GeoLocation>
>

export type TrailPoint = GeoLocation & { id: string }

export const DeviceLocationContext = createContext<{
	locations: Locations
	timeSpan: TimeSpan
	setTimeSpan: (type: TimeSpan) => void
	trail: TrailPoint[]
}>({
	locations: {},
	timeSpan: TimeSpan.lastHour,
	setTimeSpan: () => undefined,
	trail: [],
})

/**
 * FIXME: Fetch location history via REST
 */
export const Provider = ({ children }: { children: ComponentChildren }) => {
	const { onReported, device, reported } = useDevice()
	const [timeSpan, setTimeSpan] = useState<TimeSpan>(TimeSpan.lastHour)
	const [locations, setLocations] = useState<Locations>({})
	const [trail] = useState<TrailPoint[]>([])

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
		setLocations(locationsFromReported(reported))
	}, [reported])

	return (
		<DeviceLocationContext.Provider
			value={{
				locations,
				timeSpan,
				setTimeSpan,
				trail,
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
