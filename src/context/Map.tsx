import { decodeMapState, encodeMapState } from '#map/encodeMapState.js'
import { getPolygonCoordinatesForCircle } from '#map/geoJSONPolygonFromCircle.js'
import type { GeoLocation } from '#proto/lwm2m.js'
import { isSSR } from '#utils/isSSR.js'
import maplibregl from 'maplibre-gl'
import { createContext, type ComponentChildren } from 'preact'
import { useContext, useState } from 'preact/hooks'

export enum MapStyle {
	DARK = 'dark',
	LIGHT = 'light',
}

export type MapState = {
	lat: number
	lng: number
	zoom: number
	style: MapStyle
}

export const MapContext = createContext<{
	locked: boolean
	unlock: () => void
	lock: () => void
	toggleLock: () => void
	map?: maplibregl.Map
	setMap: (map: maplibregl.Map) => void
	clearMap: () => void
	/**
	 * Center the map on the given location
	 */
	center: (location: GeoLocation) => void
	/**
	 * Scroll the map container into view
	 */
	scrollTo: () => void
	style: MapStyle
	setStyle: (style: MapStyle) => void
	state: MapState | undefined
}>({
	locked: true,
	unlock: () => undefined,
	lock: () => undefined,
	toggleLock: () => undefined,
	setMap: () => undefined,
	clearMap: () => undefined,
	center: () => undefined,
	scrollTo: () => undefined,
	style: MapStyle.DARK,
	setStyle: () => undefined,
	state: undefined,
})

export const Provider = ({ children }: { children: ComponentChildren }) => {
	const [locked, setLocked] = useState<boolean>(true)
	const [map, setMap] = useState<maplibregl.Map | undefined>(undefined)
	const state = isSSR
		? undefined
		: decodeMapState(document.location.hash.slice(1))
	const [style, setStyle] = useState<MapStyle>(state?.style ?? MapStyle.DARK)

	return (
		<MapContext.Provider
			value={{
				locked,
				unlock: () => setLocked(false),
				lock: () => setLocked(true),
				toggleLock: () => setLocked((l) => !l),
				map,
				setMap: (map) => {
					setMap(map)
				},
				clearMap: () => {
					map?.remove()
					setMap(undefined)
				},
				center: (center) => {
					if (map === undefined) return
					const { lat, lng, acc } = center
					if (acc === undefined) {
						// Just center
						map.flyTo({
							center,
							zoom: map.getZoom(),
						})
						return
					}
					const coordinates = getPolygonCoordinatesForCircle(
						[lng, lat],
						acc,
						6,
						Math.PI / 2,
					)
					const bounds = coordinates.reduce(
						(bounds, coord) => {
							return bounds.extend(coord)
						},
						new maplibregl.LngLatBounds(coordinates[0], coordinates[0]),
					)
					map.fitBounds(bounds, {
						padding: 20,
					})
				},
				scrollTo: () => map?.getContainer().scrollIntoView(),
				style,
				setStyle: (style) => {
					style === MapStyle.LIGHT
						? setStyle(MapStyle.LIGHT)
						: setStyle(MapStyle.DARK)
					if (map !== undefined)
						document.location.hash = `#${encodeMapState(map, style)}`
				},
				state,
			}}
		>
			{children}
		</MapContext.Provider>
	)
}

export const Consumer = MapContext.Consumer

export const useMap = () => useContext(MapContext)
