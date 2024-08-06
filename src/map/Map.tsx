import {
	useDeviceLocation,
	type Locations,
	type TrailPoint,
} from '#context/DeviceLocation.js'
import { MapStyle, useMap } from '#context/Map.js'
import { useParameters } from '#context/Parameters.js'
import { CenterOnMapLocations } from '#map/CenterOnMapLocations.js'
import { HistoryControls } from '#map/HistoryControls.js'
import {
	LocationSource,
	LocationSourceLabels,
	locationSourceColors,
	locationSourceColorsDark,
} from '#map/LocationSourceLabels.js'
import { LockInfo } from '#map/LockInfo.js'
import { MapZoomControls } from '#map/MapZoomControls.js'
import { geoJSONPolygonFromCircle } from '#map/geoJSONPolygonFromCircle.js'
import { mapStyle as mapStyleLight } from '#map/style-light.js'
import { mapStyle as mapStyleDark } from '#map/style.js'
import { transformRequest } from '#map/transformRequest.js'
import { type GeoLocation } from '#proto/lwm2m.js'
import { byTs } from '#utils/byTs.js'
import { formatDistanceToNow } from 'date-fns'
import { MapPinOff } from 'lucide-preact'
import maplibregl, { type GeoJSONSourceSpecification } from 'maplibre-gl'
import type React from 'preact/compat'
import { useEffect, useRef, useState } from 'preact/hooks'
import { encodeMapState } from './encodeMapState.js'

import '#map/Map.css'

const defaultColor = '#C7C7C7'

// See https://docs.aws.amazon.com/location/latest/developerguide/esri.html for available fonts
const glyphFonts = {
	regular: 'Ubuntu Regular',
	bold: 'Ubuntu Medium',
} as const

const getCenter = (locations: Locations): GeoLocation | undefined =>
	Object.values(locations).sort(byTs)[0]

export const Map = ({
	mapControls,
	canBeLocked,
}: {
	mapControls?: React.ReactElement
	/**
	 * Whether to enable the lock button
	 */
	canBeLocked?: boolean
}) => {
	const { onParameters } = useParameters()
	const containerRef = useRef<HTMLDivElement>(null)
	const { locations, trail, clustering } = useDeviceLocation()
	const hasLocation = Object.values(locations).length > 0
	const [mapLoaded, setMapLoaded] = useState<boolean>(false)
	const { locked, setMap, clearMap, map, style: currentStyle, state } = useMap()
	const isLocked = (canBeLocked ?? true) ? locked : false

	const trailBySource = trail.reduce<Record<string, TrailPoint[]>>(
		(acc, location) => {
			if (acc[location.src] === undefined) {
				acc[location.src] = [location]
			} else {
				acc[location.src]!.push(location)
			}
			return acc
		},
		{},
	)

	const { lat, lng, zoom, style } = state ?? {
		// Trondheim
		lat: 63.42148461054351,
		lng: 10.437581513483195,
		zoom: 10,
		style: currentStyle,
	}

	const sourceColors =
		style === MapStyle.DARK ? locationSourceColors : locationSourceColorsDark

	useEffect(() => {
		if (containerRef.current === null) return

		onParameters(({ mapRegion, mapName, mapApiKey }) => {
			console.log(`[Map]`, `initializing`, { lat, lng, zoom })
			const map = new maplibregl.Map({
				container: 'map',
				style: (style === MapStyle.LIGHT ? mapStyleLight : mapStyleDark)({
					region: mapRegion,
					mapName,
				}),
				center: {
					lng,
					lat,
				},
				zoom,
				transformRequest: transformRequest(mapApiKey, mapRegion),
				refreshExpiredTiles: false,
				trackResize: true,
				keyboard: false,
				renderWorldCopies: false,
			})

			if (canBeLocked ?? true) {
				map.dragRotate.disable()
				map.scrollZoom.disable()
				map.dragPan.disable()
			}

			map.on('load', () => {
				setMapLoaded(true)
			})

			setMap(map)
		})

		return () => {
			clearMap()
		}
	}, [containerRef.current])

	// Persist map state
	useEffect(() => {
		if (map === undefined) return
		const persistMapState = () => {
			document.location.hash = `#${encodeMapState(map, style)}`
		}
		map.on('moveend', persistMapState)

		return () => {
			map?.off('moveend', persistMapState)
		}
	}, [map, state])

	// Center the map on current location
	useEffect(() => {
		if (!isLocked) return // Don't override user set center
		if (state !== undefined) return
		if (map === undefined) return
		const centerLocation = getCenter(locations)
		if (centerLocation === undefined) return
		console.debug(`[Map]`, 'center', centerLocation)
		map.flyTo({
			center: centerLocation,
			zoom: map.getZoom(),
		})
	}, [locations, map, isLocked, state])

	// Center map on last known location
	useEffect(() => {
		if (!isLocked) return // Don't override user set center
		if (state !== undefined) return
		if (map === undefined) return
		if (hasLocation) return
		console.debug(`[Map]`, 'center', trail[trail.length - 1])
		map.flyTo({
			center: trail[trail.length - 1],
			zoom: map.getZoom(),
		})
	}, [trail, locations, map, isLocked, state])

	// Locations
	useEffect(() => {
		if (!hasLocation) return
		if (map === undefined) return
		if (!mapLoaded) return

		const layerIds: string[] = []
		const sourceIds: string[] = []

		for (const location of Object.values(locations)) {
			const { lng, lat, acc, src, ts } = location
			const locationCenterSourceId = `${location.src}-source-center`
			const locationSourceLabel = `${location.src}-location-source-label`
			const locationAgeLabel = `${location.src}-location-age-label`
			const centerSource = map.getSource(locationCenterSourceId)

			// Add layer (if not already on map)
			if (centerSource === undefined) {
				console.debug(`[Map]`, `adding`, location)

				// Data for Center point
				map.addSource(locationCenterSourceId, toGEOJsonPoint([lat, lng]))
				sourceIds.push(locationCenterSourceId)
				// Render location source in center
				map.addLayer({
					id: locationSourceLabel,
					type: 'symbol',
					source: locationCenterSourceId,
					layout: {
						'symbol-placement': 'point',
						'text-field': LocationSourceLabels.get(src) ?? src,
						'text-font': [glyphFonts.bold],
						'text-offset': [0, 0],
					},
					paint: {
						'text-color': sourceColors.get(src) ?? defaultColor,
					},
				})
				layerIds.push(locationSourceLabel)
				// Render location age in center
				map.addLayer({
					id: locationAgeLabel,
					type: 'symbol',
					source: locationCenterSourceId,
					layout: {
						'symbol-placement': 'point',
						'text-field': formatDistanceToNow(ts, { addSuffix: true }),
						'text-font': [glyphFonts.regular],
						'text-offset': [0, 2],
					},
					paint: {
						'text-color': sourceColors.get(src) ?? defaultColor,
					},
				})
				layerIds.push(locationAgeLabel)
				if (acc !== undefined) {
					const hexagon = addHexagon(
						map,
						{ ...location, acc },
						sourceColors.get(src) ?? defaultColor,
					)
					sourceIds.push(...hexagon.sourceIds)
					layerIds.push(...hexagon.layerIds)
				}
			}
		}
		return () => {
			layerIds.map((id) => map.removeLayer(id))
			sourceIds.map((id) => map.removeSource(id))
		}
	}, [locations, map, mapLoaded])

	// Trail
	useEffect(() => {
		if (map === undefined) return
		if (!mapLoaded) return

		const layerIds: string[] = []
		const sourceIds: string[] = []

		for (const [src, trail] of Object.entries(trailBySource)) {
			for (const point of trail) {
				const { lng, lat, ts } = point
				const locationCenterSourceId = `${point.id}-source-center`
				const locationSourceLabel = `${point.id}-location-source-label`
				const centerSource = map.getSource(locationCenterSourceId)

				// Add layer (if not already on map)
				if (centerSource === undefined) {
					console.debug(`[Map]`, `adding`, point)

					// Data for Center point
					map.addSource(locationCenterSourceId, toGEOJsonPoint([lat, lng]))
					sourceIds.push(locationCenterSourceId)
					// Render location info
					map.addLayer({
						id: locationSourceLabel,
						type: 'symbol',
						source: locationCenterSourceId,
						layout: {
							'symbol-placement': 'point',
							'text-field': `${formatDistanceToNow(ts, { addSuffix: true })}`,
							'text-font': [glyphFonts.regular],
							'text-offset': [0, 0],
						},
						paint: {
							'text-color': sourceColors.get(src) ?? defaultColor,
						},
					})
					layerIds.push(locationSourceLabel)

					if (clustering === true && point.acc !== undefined) {
						const hexagon = addHexagon(
							map,
							{ ...point, acc: point.acc, src: point.id },
							sourceColors.get(src) ?? defaultColor,
						)
						sourceIds.push(...hexagon.sourceIds)
						layerIds.push(...hexagon.layerIds)
					}
				}
			}

			// Line for trail
			const trailSourceId = `${src}-source-trail`
			map.addSource(trailSourceId, {
				type: 'geojson',
				data: {
					type: 'Feature',
					properties: {},
					geometry: {
						type: 'LineString',
						coordinates: trail.map(({ lat, lng }) => [lng, lat]),
					},
				},
			})
			sourceIds.push(trailSourceId)

			// Render trail
			const trailLayerId = `${src}-layer-trail`
			map.addLayer({
				id: trailLayerId,
				type: 'line',
				source: trailSourceId,
				layout: {},
				paint: {
					'line-color': sourceColors.get(src) ?? defaultColor,
					'line-opacity': 0.5,
					'line-width': 2,
					'line-dasharray': [2, 2],
				},
			})
			layerIds.push(trailLayerId)
		}

		return () => {
			layerIds.map((id) => map.removeLayer(id))
			sourceIds.map((id) => map.removeSource(id))
		}
	}, [trail, map, clustering, mapLoaded])

	// Enable zoom
	useEffect(() => {
		if (isLocked) {
			map?.dragRotate.disable()
			map?.scrollZoom.disable()
			map?.dragPan.disable()
		} else {
			map?.dragRotate.enable()
			map?.scrollZoom.enable()
			map?.dragPan.enable()
		}
	}, [isLocked])

	const scellLocation = locations[LocationSource.SCELL]
	const mcellLocation = locations[LocationSource.MCELL]
	const cellularLocations: GeoLocation[] = []
	if (scellLocation !== undefined) cellularLocations.push(scellLocation)
	if (mcellLocation !== undefined) cellularLocations.push(mcellLocation)

	return (
		<section class="map bg-dark">
			<div id="map" ref={containerRef} class="scroll-margin-flush" />

			{!hasLocation && isLocked && (
				<div class="noLocationInfo">
					<span>
						<MapPinOff /> waiting for location
					</span>
				</div>
			)}
			{(canBeLocked ?? true) && <LockInfo />}
			<div class="locationControls">
				<CenterOnMapLocations />
				<HistoryControls />
			</div>
			<div class="mapControls controls vertical">
				{mapControls}
				<MapZoomControls canBeLocked={canBeLocked} />
			</div>
		</section>
	)
}

const toGEOJsonPoint = ([lat, lng]: [
	lat: number,
	lng: number,
]): GeoJSONSourceSpecification => ({
	type: 'geojson',
	data: {
		type: 'Feature',
		geometry: {
			type: 'Point',
			coordinates: [lng, lat],
		},
		properties: {},
	},
})

const addHexagon = (
	map: maplibregl.Map,
	{ lng, lat, src, acc }: GeoLocation & { acc: number },
	color: string,
) => {
	const locationAreaSourceId = `${src}-location-area-source`
	const locationAreaLayerId = `${src}-location-area-layer`
	const locationAreaLabelId = `${src}-location-area-label`
	const sourceIds = []
	const layerIds = []
	// Data for Hexagon
	map.addSource(
		locationAreaSourceId,
		geoJSONPolygonFromCircle([lng, lat], acc, 6, Math.PI / 2),
	)
	sourceIds.push(locationAreaSourceId)
	// Render Hexagon
	map.addLayer({
		id: locationAreaLayerId,
		type: 'line',
		source: locationAreaSourceId,
		layout: {},
		paint: {
			'line-color': color,
			'line-opacity': 1,
			'line-width': 2,
		},
	})
	layerIds.push(locationAreaLayerId)
	// Render label on Hexagon
	map.addLayer({
		id: locationAreaLabelId,
		type: 'symbol',
		source: locationAreaSourceId,
		layout: {
			'symbol-placement': 'line',
			'text-field': `${Math.round(acc)} m`,
			'text-font': [glyphFonts.regular],
			'text-offset': [0, -1],
			'text-size': 14,
		},
		paint: {
			'text-color': color,
		},
	})
	layerIds.push(locationAreaLabelId)

	return {
		layerIds,
		sourceIds,
	}
}
