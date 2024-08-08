import type { TimeSpan } from '#api/api.js'
import {
	decodeMapState,
	encodeMapState,
	MapStyle,
	type MapStateType,
} from '#map/encodeMapState.js'
import type { GeoLocation } from '#proto/lwm2m.js'
import { isSSR } from '#utils/isSSR.js'
import { createContext, type ComponentChildren } from 'preact'
import { useContext, useEffect, useState } from 'preact/hooks'
import { useDeviceLocation } from './DeviceLocation.js'

export const defaultMapState: MapStateType = {
	// Nordic Semiconductor HQ in Trondheim
	center: {
		lat: 63.42121995865395,
		lng: 10.436532449270203,
	},
	zoom: 10.776208705876128,
	style: MapStyle.DARK,
	cluster: false,
}

type Center = Pick<GeoLocation, 'lat' | 'lng'>

export const MapStateContext = createContext<{
	unlock: () => void
	lock: () => void
	toggleLock: () => void
	locked: boolean
	setCenter: (center: Center) => void
	setStyle: (style: MapStyle) => void
	state: MapStateType
	showHistory: (timeSpan: TimeSpan) => void
	hideHistory: () => void
	setZoom: (zoom: MapStateType['zoom']) => void
}>({
	unlock: () => undefined,
	lock: () => undefined,
	toggleLock: () => undefined,
	locked: true,
	setStyle: () => undefined,
	state: defaultMapState,
	showHistory: () => undefined,
	hideHistory: () => undefined,
	setCenter: () => undefined,
	setZoom: () => undefined,
})

export const Provider = ({ children }: { children: ComponentChildren }) => {
	const { clustering, timeSpan } = useDeviceLocation()
	const [state, setState] = useState<MapStateType>(
		isSSR
			? defaultMapState
			: (decodeMapState(document.location.hash.slice(1)) ?? defaultMapState),
	)
	const [locked, setLocked] = useState(true)

	const setCenter = (center: Center) => {
		const { lat, lng } = center
		setState((state) => ({
			...state,
			center: { lat, lng },
		}))
	}

	// Sync state to URL
	useEffect(() => {
		const encodedState = encodeMapState(state)
		if (document.location.hash.includes(encodedState)) return
		console.debug(`[MapContext] Syncing state: ${encodedState}`)
		document.location.hash = `#${encodedState}`
	}, [state])

	// Sync clustering
	useEffect(() => {
		if (state.cluster === clustering) return
		console.debug(`[MapContext] Syncing clustering to ${clustering}`)
		setState((state) => ({
			...state,
			cluster: clustering,
		}))
	}, [clustering, state])

	// Sync history
	useEffect(() => {
		if (state.history === timeSpan) return
		console.debug(`[MapContext] Syncing history to ${timeSpan}`)
		setState((state) => ({
			...state,
			history: timeSpan,
		}))
	}, [timeSpan, state])

	return (
		<MapStateContext.Provider
			value={{
				unlock: () => {
					setLocked(false)
				},
				lock: () => {
					setLocked(true)
				},
				toggleLock: () => {
					setLocked((locked) => !locked)
				},
				locked,
				setCenter,
				setStyle: (style) => {
					setState((state) => ({
						...state,
						style,
					}))
				},
				state,
				showHistory: (timeSpan) => {
					setState((state) => ({
						...state,
						history: timeSpan,
					}))
				},
				hideHistory: () => {
					setState((state) => {
						const { history, ...rest } = state
						void history
						return rest
					})
				},
				setZoom: (zoom) => {
					setState((state) => ({
						...state,
						zoom,
					}))
				},
			}}
		>
			{children}
		</MapStateContext.Provider>
	)
}

export const Consumer = MapStateContext.Consumer

export const useMapState = () => useContext(MapStateContext)
