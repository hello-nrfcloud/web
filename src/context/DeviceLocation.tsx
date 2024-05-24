import type { LocationSource } from '#map/LocationSourceLabels.js'
import { createContext, type ComponentChildren } from 'preact'
import { useContext, useEffect, useState } from 'preact/hooks'
import { useDevice, type MessageListenerFn } from './Device.js'
import { isGeolocation, toGeoLocation, type GeoLocation } from '#proto/lwm2m.js'
import { TimeSpan } from '#api/api.js'

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
	const { addMessageListener, device } = useDevice()
	const [timeSpan, setTimeSpan] = useState<TimeSpan>(TimeSpan.lastHour)

	const [locations, setLocations] = useState<Locations>({})
	const [trail] = useState<TrailPoint[]>([])

	useEffect(() => {
		if (device === undefined) return
		const listener: MessageListenerFn = (message) => {
			if (isGeolocation(message))
				setLocations((l) => ({
					...l,
					[message.Resources[6]]: toGeoLocation(message),
				}))
		}
		const { remove } = addMessageListener(listener)

		return () => {
			remove()
		}
	}, [device])

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
