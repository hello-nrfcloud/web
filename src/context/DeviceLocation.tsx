import { Context } from '@hello.nrfcloud.com/proto/hello'
import {
	Location,
	LocationSource,
} from '@hello.nrfcloud.com/proto/hello/model/PCA20035+solar'
import { type Static } from '@sinclair/typebox'
import { createContext, type ComponentChildren } from 'preact'
import { useContext, useEffect, useState } from 'preact/hooks'
import { useDevice, type MessageListenerFn } from './Device.js'
import type { IncomingMessageType } from '#proto/proto.js'
import type { TimeSpan } from '@hello.nrfcloud.com/proto/hello/history/TimeSpan.js'
import { generateUUID } from '#utils/generateUUID.js'
import type { LocationTrailRequest } from '@hello.nrfcloud.com/proto/hello/history/HistoricalDataRequest.js'
import type {
	CommonResponse,
	LocationTrailResponse,
} from '@hello.nrfcloud.com/proto/hello/history/HistoricalDataResponse.js'
import type { LocationTrailData } from '@hello.nrfcloud.com/proto/hello/history/HistoricalData.js'
import { byTs } from './byTs.js'

export type Locations = Partial<
	Record<keyof typeof LocationSource, Static<typeof Location>>
>

export type TrailPoint = Static<typeof LocationTrailData> & { id: string }

export const DeviceLocationContext = createContext<{
	locations: Locations
	timeSpan: Static<typeof TimeSpan>
	setTimeSpan: (type: Static<typeof TimeSpan>) => void
	trail: TrailPoint[]
}>({
	locations: {},
	timeSpan: 'lastHour',
	setTimeSpan: () => undefined,
	trail: [],
})

export const Provider = ({ children }: { children: ComponentChildren }) => {
	const { addMessageListener, device, send } = useDevice()
	const [timeSpan, setTimeSpan] = useState<Static<typeof TimeSpan>>('lastHour')

	const [locations, setLocations] = useState<Locations>({})
	const [trail, setTrail] = useState<TrailPoint[]>([])

	useEffect(() => {
		if (device === undefined) return
		const listener: MessageListenerFn = (message) => {
			if (isLocation(message, device.model.name))
				setLocations((l) => ({ ...l, [message.src]: message }))
			if (isLocationTrail(message)) {
				setTrail((trail) =>
					[
						...trail,
						...(message.attributes as Static<typeof LocationTrailData>[]).map(
							(point) => ({
								...point,
								id: generateUUID(),
							}),
						),
					].sort(byTs),
				)
				console.log(`[Location]`, message)
			}
		}
		const { remove } = addMessageListener(listener)

		return () => {
			remove()
		}
	}, [device])

	useEffect(() => {
		if (send === undefined) return
		console.log(`[Location]`, `Requesting location history`)
		const locationHistory: Static<typeof LocationTrailRequest> = {
			'@context': Context.historicalDataRequest.toString(),
			'@id': generateUUID(),
			type: timeSpan,
			message: 'locationTrail',
			minDistanceKm: 1,
		}
		send(locationHistory)
	}, [send, timeSpan])

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

const isLocation = (
	message: IncomingMessageType,
	model: string,
): message is Static<typeof Location> =>
	message['@context'] ===
	Context.model(model).transformed('location').toString()

const isLocationTrail = (
	message: IncomingMessageType,
): message is Static<typeof LocationTrailResponse> =>
	message['@context'] === Context.historicalDataResponse.toString() &&
	(message as Static<typeof CommonResponse>).message === 'locationTrail'
