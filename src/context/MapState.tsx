import type { TimeSpan } from '#api/api.js'
import {
	decodeMapState,
	encodeMapState,
	type MapStyle,
	type MapStateType,
} from '#map/encodeMapState.js'
import { isSSR } from '#utils/isSSR.js'
import { createContext, type ComponentChildren } from 'preact'
import { useContext, useEffect, useState } from 'preact/hooks'
import { useDeviceLocation } from './DeviceLocation.js'

type Center = NonNullable<MapStateType['center']>

export const MapStateContext = createContext<{
	unlock: () => void
	lock: () => void
	toggleLock: () => void
	locked: boolean
	setCenter: (center: Center) => void
	setStyle: (style: MapStyle) => void
	state?: MapStateType
	showHistory: (timeSpan: TimeSpan) => void
	hideHistory: () => void
	clusterTrail: (enabled: boolean) => void
	setZoom: (zoom: MapStateType['zoom']) => void
}>({
	unlock: () => undefined,
	lock: () => undefined,
	toggleLock: () => undefined,
	locked: true,
	setStyle: () => undefined,
	showHistory: () => undefined,
	hideHistory: () => undefined,
	setCenter: () => undefined,
	setZoom: () => undefined,
	clusterTrail: () => undefined,
})

export const Provider = ({ children }: { children: ComponentChildren }) => {
	const { clustering, timeSpan } = useDeviceLocation()
	const [state, setState] = useState<MapStateType | undefined>(
		isSSR ? undefined : decodeMapState(document.location.hash.slice(1)),
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
		if (state === undefined) return
		const encodedState = encodeMapState(state)
		if (document.location.hash.includes(encodedState)) return
		console.debug(`[MapContext] Syncing state`, encodedState)
		document.location.hash = `#${encodedState}`
	}, [state])

	// Sync clustering
	useEffect(() => {
		if (state?.cluster === clustering) return
		console.debug(`[MapContext] Syncing clustering`, clustering)
		setState((state) => ({
			...state,
			cluster: clustering,
		}))
	}, [clustering, state])

	// Sync history
	useEffect(() => {
		if (state?.history === timeSpan) return
		console.debug(`[MapContext] Syncing history`, timeSpan)
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
						const { history, ...rest } = state ?? {}
						void history
						return rest
					})
				},
				clusterTrail: (enabled) => {
					setState((state) => ({
						...state,
						cluster: enabled,
					}))
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
