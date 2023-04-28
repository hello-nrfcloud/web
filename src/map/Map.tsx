import { isEqual } from 'lodash-es'
import { MapPinOff } from 'lucide-preact'
import type {
	GeoJSONSource,
	LngLatLike,
	PropertyValueSpecification,
} from 'maplibre-gl'
// Needed for SSR build, named exports don't work
import { useParameters } from '@context/Parameters.js'
import maplibregl from 'maplibre-gl'
import { createContext } from 'preact'
import { useContext, useEffect, useRef } from 'preact/hooks'
import { styled } from 'styled-components'
import { useCognitoCredentials } from '../context/CognitoCredentials.js'
import { geoJSONPolygonFromCircle } from './geoJSONPolygonFromCircle.js'
import { mapStyle } from './style.js'
import { transformRequest } from './transformRequest.js'

export enum GeoLocationSource {
	GNSS = 'gnss',
	fixed = 'fixed',
	network = 'network',
}

export type GeoLocation = {
	lat: number
	lng: number
	accuracy: number
	source: GeoLocationSource
	label?: string
	ts?: Date
}

// Source: https://coolors.co/palette/22577a-38a3a5-57cc99-80ed99-c7f9cc
export const locationSourceColors = {
	[GeoLocationSource.GNSS]: '#C7F9CC',
	[GeoLocationSource.network]: '#38A3A5',
	[GeoLocationSource.fixed]: '#22577A',
} as const

// Uses nrfcloud.com wording
export const LocationSourceLabels = {
	[GeoLocationSource.GNSS]: 'GNSS',
	[GeoLocationSource.network]: 'Network',
	[GeoLocationSource.fixed]: 'Fixed',
}

export const MapContext = createContext<DeviceMap>(undefined as any)

export const Consumer = MapContext.Consumer

export const useMap = () => useContext(MapContext)

const deviceLocations: Record<string, GeoLocation> = {}

type DeviceMap = {
	showDeviceLocation: (args: {
		deviceId: string
		deviceAlias: string
		location: GeoLocation
		hidden?: boolean
	}) => void
	center: (center: GeoLocation, zoom?: number) => void
}

// See https://docs.aws.amazon.com/location/latest/developerguide/esri.html for available fonts
const glyphFonts = {
	regular: 'Ubuntu Regular',
	bold: 'Ubuntu Medium',
} as const

export const locationSourceDashArray: Record<
	GeoLocationSource,
	PropertyValueSpecification<Array<number>>
> = {
	[GeoLocationSource.GNSS]: [1],
	[GeoLocationSource.network]: [1, 1],
	[GeoLocationSource.fixed]: [1],
}

let zooming = false

/**
 * The `map` parameter is potentially undefined,
 * because it sometimes happens that the map instance is no longer available
 */
export const deviceMap = (map: maplibregl.Map | undefined): DeviceMap => {
	const isLoaded = new Promise((resolve) => map?.on('load', resolve))
	const centerOnDeviceZoomLevel = 12

	map?.on('zoomstart', () => {
		console.debug('[map]', 'zoom start')
		zooming = true
	})
	map?.on('zoomend', () => {
		console.debug('[map]', 'zoom end')
		zooming = false
	})

	return {
		showDeviceLocation: async ({ deviceId, deviceAlias, location, hidden }) => {
			if (map === undefined) {
				console.error(`[Map]`, `Map is not available.`)
				return
			}

			// Suspend updates during zooming
			if (zooming) {
				return
			}

			// Check if update is needed
			if (isEqual(location, deviceLocations[deviceId])) {
				return
			}
			deviceLocations[deviceId] = location
			const { source, lat, lng, accuracy, label } = location

			await isLoaded

			const locationAreaBaseId = `${deviceId}-location-${source}-area`

			const locationAreaSourceId = `${locationAreaBaseId}-source`
			const centerSourceId = `${locationAreaBaseId}-center`
			const areaSource = map.getSource(locationAreaSourceId)

			const areaLayerId = `${locationAreaBaseId}-circle`
			const areaLayerLabelId = `${locationAreaBaseId}-label`
			const centerLabelId = `${locationAreaBaseId}-deviceId-label`
			const centerLabelSource = `${locationAreaBaseId}-source-label`

			if (areaSource === undefined) {
				if (hidden === true) {
					// Don't add
					return
				}
				// Create new sources and layers
				// For properties, see https://maplibre.org/maplibre-gl-js-docs/style-spec/layers/
				// Data for Hexagon
				console.debug(`[map]`, 'add source', locationAreaBaseId, location)
				map.addSource(
					locationAreaSourceId,
					geoJSONPolygonFromCircle([lng, lat], accuracy, 6, Math.PI / 2),
				)
				// Center point
				map.addSource(centerSourceId, {
					type: 'geojson',
					data: {
						type: 'Feature',
						geometry: {
							type: 'Point',
							coordinates: [lng, lat],
						},
					},
				})
				// Render Hexagon
				map.addLayer({
					id: areaLayerId,
					type: 'line',
					source: locationAreaSourceId,
					layout: {},
					paint: {
						'line-color': locationSourceColors[source],
						'line-opacity': 1,
						'line-width': 2,
						'line-dasharray': locationSourceDashArray[source],
					},
				})
				// Render label on Hexagon
				map.addLayer({
					id: areaLayerLabelId,
					type: 'symbol',
					source: locationAreaSourceId,
					layout: {
						'symbol-placement': 'line',
						'text-field': `${deviceAlias} (${
							LocationSourceLabels[source]
						}, ${Math.round(accuracy)} m)`,
						'text-font': [glyphFonts.regular],
						'text-offset': [0, -1],
						'text-size': 14,
					},
					paint: {
						'text-color': locationSourceColors[source],
						'text-halo-color': '#222222',
						'text-halo-width': 1,
						'text-halo-blur': 1,
					},
				})
				// Render deviceID in center
				map.addLayer({
					id: centerLabelId,
					type: 'symbol',
					source: centerSourceId,
					layout: {
						'symbol-placement': 'point',
						'text-field': deviceAlias,
						'text-font': [glyphFonts.bold],
						'text-offset': [0, 0],
					},
					paint: {
						'text-color': locationSourceColors[source],
					},
				})
				map.addLayer({
					id: centerLabelSource,
					type: 'symbol',
					source: centerSourceId,
					layout: {
						'symbol-placement': 'point',
						'text-field': label ?? LocationSourceLabels[source],
						'text-font': [glyphFonts.regular],
						'text-offset': [0, 2],
						'text-size': 14,
					},
					paint: {
						'text-color': locationSourceColors[source],
					},
				})

				// Center the map on the coordinates of any clicked symbol from the layer.
				map.on('click', centerLabelId, (e) => {
					const center = (
						e.features?.[0]?.geometry as { coordinates: LngLatLike } | undefined
					)?.coordinates

					if (center === undefined) return

					map.flyTo({
						center,
						zoom: centerOnDeviceZoomLevel,
					})
				})

				// Change the cursor to a pointer when the it enters a feature in the layer.
				map.on('mouseenter', centerLabelId, () => {
					map.getCanvas().style.cursor = 'pointer'
				})

				// Change it back to a pointer when it leaves.
				map.on('mouseleave', centerLabelId, () => {
					map.getCanvas().style.cursor = ''
				})
			} else {
				if (hidden === true) {
					// Remove
					if (map.getLayer(areaLayerId) !== undefined)
						map.removeLayer(areaLayerId)
					if (map.getLayer(areaLayerLabelId) !== undefined)
						map.removeLayer(areaLayerLabelId)
					if (map.getLayer(centerLabelId) !== undefined)
						map.removeLayer(centerLabelId)
					if (map.getLayer(centerLabelSource) !== undefined)
						map.removeLayer(centerLabelSource)
					map.removeSource(locationAreaSourceId)
					if (map.getSource(centerSourceId) !== undefined)
						map.removeSource(centerSourceId)

					return
				}
				// Update existing sources
				;(areaSource as GeoJSONSource).setData(
					geoJSONPolygonFromCircle([lng, lat], accuracy, 6, Math.PI / 2)
						.data as GeoJSON.FeatureCollection,
				)
				;(map.getSource(centerSourceId) as GeoJSONSource)?.setData({
					type: 'Feature',
					geometry: {
						type: 'Point',
						coordinates: [lng, lat],
					},
				} as GeoJSON.Feature)
			}
		},
		center: (center, zoom) =>
			map?.flyTo({ center, zoom: zoom ?? centerOnDeviceZoomLevel }),
	}
}

const MapContainer = styled.div`
	width: 100%;
	height: 50vh;
`

const MapSection = styled.section`
	position: relative;
	width: 100%;
	height: 50vh;
`

const NoLocation = styled.div`
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 50vh;
	font-size: 200%;
	color: #ffffff80;
	display: flex;
	align-items: center;
	justify-content: center;
`

export const Map = () => {
	const { mapName, region } = useParameters()
	const { credentials } = useCognitoCredentials()
	const containerRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		if (containerRef.current === null) return

		const map = new maplibregl.Map({
			container: 'map',
			style: mapStyle({
				region,
				mapName,
			}),
			center: [10.437581513483195, 63.42148461054351],
			zoom: 12,
			transformRequest: transformRequest(credentials, region),
			refreshExpiredTiles: false,
			trackResize: true,
			keyboard: false,
			renderWorldCopies: false,
			// Static map, no mouse interaction at all
			interactive: false,
		})

		return () => {
			map?.remove()
		}
	}, [containerRef.current])

	return (
		<MapSection>
			<MapContainer id="map" ref={containerRef} />
			<NoLocation>
				<p>
					<MapPinOff strokeWidth={1} style={{ zoom: 4 }} /> waiting for location
				</p>
			</NoLocation>
		</MapSection>
	)
}
