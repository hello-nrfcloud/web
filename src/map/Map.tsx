import { useDeviceLocation, type Locations } from '#context/DeviceLocation.js'
import { useMap } from '#context/Map.js'
import { useParameters } from '#context/Parameters.js'
import {
	LocationSource,
	LocationSourceLabels,
	locationSourceColors,
} from '#map/LocationSourceLabels.js'
import { geoJSONPolygonFromCircle } from '#map/geoJSONPolygonFromCircle.js'
import { mapStyle } from '#map/style.js'
import { transformRequest } from '#map/transformRequest.js'
import { type GeoLocation } from '#proto/lwm2m.js'
import { formatDistanceToNow } from 'date-fns'
import { MapPinOff } from 'lucide-preact'
import maplibregl, { type GeoJSONSourceSpecification } from 'maplibre-gl'
import { useEffect, useRef, useState } from 'preact/hooks'
import { LockInfo } from '#map/LockInfo.js'
import { MapZoomControls } from '#map/MapZoomControls.js'
import { HistoryControls } from '#map/HistoryControls.js'
import type React from 'preact/compat'
import { CenterOnMapLocations } from '#map/CenterOnMapLocations.js'
import { byTs } from '#utils/byTs.js'

import '#map/Map.css'

const trailColor = '#e169a5'
const defaultColor = '#C7C7C7'

// See https://docs.aws.amazon.com/location/latest/developerguide/esri.html for available fonts
const glyphFonts = {
	regular: 'Ubuntu Regular',
	bold: 'Ubuntu Medium',
} as const

const getCenter = (locations: Locations): GeoLocation | undefined =>
	Object.values(locations).sort(byTs)[0]

export const Map = ({ mapControls }: { mapControls?: React.ReactElement }) => {
	const { onParameters } = useParameters()
	const containerRef = useRef<HTMLDivElement>(null)
	const { locations, trail, clustering } = useDeviceLocation()
	const hasLocation = Object.values(locations).length > 0
	const [mapLoaded, setMapLoaded] = useState<boolean>(false)
	const { locked, setMap, clearMap, map } = useMap()

	useEffect(() => {
		if (containerRef.current === null) return
		onParameters(({ mapRegion, mapName, mapApiKey }) => {
			const map = new maplibregl.Map({
				container: 'map',
				style: mapStyle({
					region: mapRegion,
					mapName,
				}),
				center: [10.437581513483195, 63.42148461054351], // Trondheim
				zoom: 10,
				transformRequest: transformRequest(mapApiKey, mapRegion),
				refreshExpiredTiles: false,
				trackResize: true,
				keyboard: false,
				renderWorldCopies: false,
			})

			map.dragRotate.disable()
			map.scrollZoom.disable()
			map.dragPan.disable()

			map.on('load', () => {
				setMapLoaded(true)
			})

			setMap(map)
		})

		return () => {
			clearMap()
		}
	}, [containerRef.current])

	// Center the map on current location
	useEffect(() => {
		if (!locked) return // Don't override user set center
		if (map === undefined) return
		const centerLocation = getCenter(locations)
		if (centerLocation === undefined) return
		console.log(`[Map]`, 'center', centerLocation)
		map.flyTo({
			center: centerLocation,
			zoom: map.getZoom(),
		})
	}, [locations, map, locked])

	// Center map on last known location
	useEffect(() => {
		if (!locked) return // Don't override user set center
		if (map === undefined) return
		if (hasLocation) return
		console.log(`[Map]`, 'center', trail[trail.length - 1])
		map.flyTo({
			center: trail[trail.length - 1],
			zoom: map.getZoom(),
		})
	}, [trail, locations, map, locked])

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
				console.log(`[Map]`, `adding`, location)

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
						'text-color': locationSourceColors.get(src) ?? defaultColor,
						'text-halo-color': '#222222',
						'text-halo-width': 1,
						'text-halo-blur': 1,
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
						'text-color': locationSourceColors.get(src) ?? defaultColor,
						'text-halo-color': '#222222',
						'text-halo-width': 1,
						'text-halo-blur': 1,
					},
				})
				layerIds.push(locationAgeLabel)
				if (acc !== undefined) {
					const hexagon = addHexagon(
						map,
						{ ...location, acc },
						locationSourceColors.get(src) ?? defaultColor,
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

		for (const point of trail) {
			const { lng, lat, ts } = point
			const locationCenterSourceId = `${point.id}-source-center`
			const locationSourceLabel = `${point.id}-location-source-label`
			const centerSource = map.getSource(locationCenterSourceId)

			// Add layer (if not already on map)
			if (centerSource === undefined) {
				console.log(`[Map]`, `adding`, point)

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
						'text-color': trailColor,
						'text-halo-color': '#222222',
						'text-halo-width': 1,
						'text-halo-blur': 1,
					},
				})
				layerIds.push(locationSourceLabel)

				if (clustering === true && point.acc !== undefined) {
					const hexagon = addHexagon(
						map,
						{ ...point, acc: point.acc },
						trailColor,
					)
					sourceIds.push(...hexagon.sourceIds)
					layerIds.push(...hexagon.layerIds)
				}
			}
		}

		// Line for trail
		const trailSourceId = `source-trail`
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
		const trailLayerId = `layer-trail`
		map.addLayer({
			id: trailLayerId,
			type: 'line',
			source: trailSourceId,
			layout: {},
			paint: {
				'line-color': trailColor,
				'line-opacity': 0.5,
				'line-width': 2,
				'line-dasharray': [2, 2],
			},
		})
		layerIds.push(trailLayerId)

		return () => {
			layerIds.map((id) => map.removeLayer(id))
			sourceIds.map((id) => map.removeSource(id))
		}
	}, [trail, map, clustering, mapLoaded])

	// Enable zoom
	useEffect(() => {
		if (locked) {
			map?.dragRotate.disable()
			map?.scrollZoom.disable()
			map?.dragPan.disable()
		} else {
			map?.dragRotate.enable()
			map?.scrollZoom.enable()
			map?.dragPan.enable()
		}
	}, [locked])

	const scellLocation = locations[LocationSource.SCELL]
	const mcellLocation = locations[LocationSource.MCELL]
	const cellularLocations: GeoLocation[] = []
	if (scellLocation !== undefined) cellularLocations.push(scellLocation)
	if (mcellLocation !== undefined) cellularLocations.push(mcellLocation)

	return (
		<section class="map bg-dark">
			<div id="map" ref={containerRef} />

			{!hasLocation && locked && (
				<div class="noLocationInfo">
					<span>
						<MapPinOff /> waiting for location
					</span>
				</div>
			)}
			<LockInfo />
			<div class="locationControls">
				<CenterOnMapLocations />
				<HistoryControls />
			</div>
			<div class="mapControls controls vertical">
				{mapControls}
				<MapZoomControls />
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
			'text-halo-color': '#222222',
			'text-halo-width': 1,
			'text-halo-blur': 1,
		},
	})
	layerIds.push(locationAreaLabelId)

	return {
		layerIds,
		sourceIds,
	}
}
