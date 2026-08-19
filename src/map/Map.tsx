import { useDeviceLocation, type TrailPoint } from '#context/DeviceLocation.tsx'
import { useMapState } from '#context/MapState.tsx'
import { CenterOnLatest } from '#map/CenterOnLatest.tsx'
import { HistoryControls } from '#map/HistoryControls.tsx'
import { LocationSourceSelector } from '#map/LocationSourceSelector.tsx'
import { LockInfo } from '#map/LockInfo.tsx'
import { MapZoomControls } from '#map/MapZoomControls.tsx'
import { MapStyle, type MapStateType } from '#map/encodeMapState.ts'
import type { GeoLocation } from '#proto/lwm2m.ts'
import { byTsReverse } from '#utils/byTs.ts'
import { formatDistanceToNow } from 'date-fns'
import { MapPinOff } from 'lucide-preact'
import { Map as MaplibreMap, setWorkerUrl } from 'maplibre-gl'
import maplibreWorkerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url'
import type React from 'preact/compat'
import { useEffect, useRef, useState } from 'preact/hooks'
import {
	locationSourceColors,
	locationSourceColorsDark,
	LocationSourceLabels,
	type LocationSource,
} from './LocationSourceLabels.ts'
import { addHexagon } from './addHexagon.ts'
import { defaultColor } from './defaultColor.tsx'
import { glyphFonts } from './glyphFonts.ts'
import { toGEOJsonPoint } from './toGEOJsonPoint.tsx'

import '#map/Map.css'

const formatAsTime = new Intl.DateTimeFormat(undefined, {
	hour: 'numeric',
	minute: 'numeric',
	month: 'short',
	day: 'numeric',
})

const formatDate = (d: Date) =>
	Date.now() - d.getTime() < 12 * 60 * 60 * 1000
		? formatDistanceToNow(d, { addSuffix: true })
		: formatAsTime.format(d)

/**
 * @see https://docs.aws.amazon.com/location/latest/developerguide/map-styles.html
 */
const mapStyleName = 'Monochrome'

export const defaultMapState = {
	// Nordic Semiconductor HQ in Trondheim
	center: {
		lat: 63.421219,
		lng: 10.436532,
	},
	zoom: 13,
	style: MapStyle.DARK,
} as const

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
	const containerRef = useRef<HTMLDivElement>(null)
	const { locations, trail } = useDeviceLocation()
	const hasLocation = Object.values(locations).length > 0
	const mapState = useMapState()
	const isLocked = (canBeLocked ?? true) ? mapState.locked : false
	const initialized = useRef<boolean>(false)
	const [mapInstance, setMap] = useState<MaplibreMap | undefined>(undefined)

	// Init map
	const {
		center: { lat, lng },
		zoom,
		style,
	} = {
		...defaultMapState,
		...mapState.state,
	}

	useEffect(() => {
		if (containerRef.current === null) return
		if (initialized.current) return
		initialized.current = true

		let syncZoom = () => undefined
		let syncPosition = () => undefined
		let onCleanup = () => undefined

		console.debug(`[Map]`, `initializing`, { lat, lng, zoom })
		setWorkerUrl(maplibreWorkerUrl)
		const map = new MaplibreMap({
			container: containerRef.current,
			style: `https://maps.geo.${MAP_REGION}.amazonaws.com/v2/styles/${mapStyleName}/descriptor?key=${MAP_API_KEY}&color-scheme=${style === MapStyle.LIGHT ? 'Light' : 'Dark'}`,
			center: {
				lng,
				lat,
			},
			zoom,
			refreshExpiredTiles: false,
			trackResize: true,
			keyboard: false,
			renderWorldCopies: false,
		})

		if ((canBeLocked ?? true) && mapState.locked) {
			map.dragRotate.disable()
			map.scrollZoom.disable()
			map.dragPan.disable()
		}

		syncZoom = () => {
			mapState.setZoom(map.getZoom())
		}

		syncPosition = () => {
			const center = map.getCenter()
			mapState.setCenter({
				lat: center.lat,
				lng: center.lng,
			})
		}

		map.on('zoomend', syncZoom)
		map.on('moveend', syncPosition)
		map.on('load', () => {
			console.debug(`[Map]`, `loaded`)
			setMap(map)
		})

		onCleanup = () => {
			console.debug(`[Map]`, `cleaning up`)
			map.off('zoomend', syncZoom)
			map.off('moveend', syncPosition)
			map.remove()
		}

		return () => {
			console.debug(`[Map]`, `unmounted`)
			onCleanup()
		}
	}, [])

	// Enable zoom
	useEffect(() => {
		if (isLocked) {
			mapInstance?.dragRotate.disable()
			mapInstance?.scrollZoom.disable()
			mapInstance?.dragPan.disable()
		} else {
			mapInstance?.dragRotate.enable()
			mapInstance?.scrollZoom.enable()
			mapInstance?.dragPan.enable()
		}
	}, [isLocked])

	const sourceColors =
		style === MapStyle.DARK ? locationSourceColors : locationSourceColorsDark

	// Locations
	useEffect(() => {
		if (mapInstance === undefined) return
		const layerIds: string[] = []
		const sourceIds: string[] = []

		for (const location of Object.values(locations)
			.sort(byTsReverse)
			.filter(removeHidden(mapState.state))) {
			const { lng, lat, acc, src, ts } = location
			const locationCenterSourceId = `${location.src} - source - center`
			const locationSourceLabel = `${location.src} - location - source - label`
			const locationAgeLabel = `${location.src} - location - age - label`
			const centerSource = mapInstance.getSource(locationCenterSourceId)

			// Add layer (if not already on map)
			if (centerSource === undefined) {
				console.debug(`[Map]`, `adding location`, location)

				// Data for Center point
				mapInstance.addSource(
					locationCenterSourceId,
					toGEOJsonPoint([lat, lng]),
				)
				sourceIds.push(locationCenterSourceId)
				// Render location source in center
				mapInstance.addLayer({
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
				mapInstance.addLayer({
					id: locationAgeLabel,
					type: 'symbol',
					source: locationCenterSourceId,
					layout: {
						'symbol-placement': 'point',
						'text-field': formatDate(ts),
						'text-font': [glyphFonts.regular],
						'text-offset': [0, 2],
						'text-size': 12,
					},
					paint: {
						'text-color': sourceColors.get(src) ?? defaultColor,
					},
				})
				layerIds.push(locationAgeLabel)
				if (acc !== undefined) {
					const hexagon = addHexagon(
						mapInstance,
						{ ...location, acc },
						sourceColors.get(src) ?? defaultColor,
						glyphFonts.regular,
					)
					sourceIds.push(...hexagon.sourceIds)
					layerIds.push(...hexagon.layerIds)
				}
			}
		}

		return () => {
			for (const layerId of layerIds) {
				try {
					mapInstance.removeLayer(layerId)
				} catch {
					console.warn(`[Map]`, `failed to remove layer`, layerId)
				}
			}
			for (const sourceId of sourceIds) {
				try {
					mapInstance.removeSource(sourceId)
				} catch {
					console.warn(`[Map]`, `failed to remove source`, sourceId)
				}
			}
		}
	}, [mapInstance, locations, mapState.state])

	// Trail
	const clustering = mapState.state?.cluster ?? false

	useEffect(() => {
		if (mapInstance === undefined) return

		const trailBySource = trail
			.filter(removeHidden(mapState.state))
			.reduce<Record<string, TrailPoint[]>>((acc, location) => {
				if (acc[location.src] === undefined) {
					acc[location.src] = [location]
				} else {
					acc[location.src]!.push(location)
				}
				return acc
			}, {})

		const layerIds: string[] = []
		const sourceIds: string[] = []

		const locationPointIds = Object.values(locations)
			.filter(removeHidden(mapState.state))
			.map((location) => hashLocation(location))

		for (const [src, trail] of Object.entries(trailBySource)) {
			for (const point of trail) {
				const { lng, lat, ts } = point
				const locationCenterSourceId = `${point.id} - source - center`
				const locationSourceLabel = `${point.id} - location - source - label`
				const centerSource = mapInstance.getSource(locationCenterSourceId)
				const isInLocation = locationPointIds.includes(hashLocation(point))

				// Add layer (if not already on map)
				if (centerSource === undefined) {
					console.debug(`[Map]`, `adding trail location`, point)

					// Data for Center point
					mapInstance.addSource(
						locationCenterSourceId,
						toGEOJsonPoint([lat, lng]),
					)
					sourceIds.push(locationCenterSourceId)
					// Render location info, if not already rendered in location
					if (!isInLocation) {
						mapInstance.addLayer({
							id: locationSourceLabel,
							type: 'symbol',
							source: locationCenterSourceId,
							layout: {
								'symbol-placement': 'point',
								'text-field': formatDate(ts),
								'text-font': [glyphFonts.regular],
								'text-offset': [0, 0],
							},
							paint: {
								'text-color': sourceColors.get(src) ?? defaultColor,
							},
						})
						layerIds.push(locationSourceLabel)
					}

					if (clustering === true && point.acc !== undefined) {
						const hexagon = addHexagon(
							mapInstance,
							{ ...point, acc: point.acc, src: point.id },
							sourceColors.get(src) ?? defaultColor,
							glyphFonts.regular,
						)
						sourceIds.push(...hexagon.sourceIds)
						layerIds.push(...hexagon.layerIds)
					}
				}
			}

			// Line for trail
			const trailSourceId = `${src} - source - trail`
			mapInstance.addSource(trailSourceId, {
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
			const trailLayerId = `${src} - layer - trail`
			mapInstance.addLayer({
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
			for (const layerId of layerIds) {
				try {
					mapInstance.removeLayer(layerId)
				} catch {
					console.warn(`[Map]`, `failed to remove layer`, layerId)
				}
			}
			for (const sourceId of sourceIds) {
				try {
					mapInstance.removeSource(sourceId)
				} catch {
					console.warn(`[Map]`, `failed to remove source`, sourceId)
				}
			}
		}
	}, [mapInstance, trail, mapState.state])

	return (
		<>
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
				{mapInstance !== undefined && (
					<>
						<div class="locationControls">
							<LocationSourceSelector />
							<HistoryControls />
						</div>
						<div class="mapControls controls vertical">
							{mapControls}
							<MapZoomControls canBeLocked={canBeLocked} map={mapInstance} />
						</div>
					</>
				)}
			</section>
			{mapInstance !== undefined && (
				<>
					<CenterOnLatest map={mapInstance} />
				</>
			)}
		</>
	)
}

const hashLocation = (location: GeoLocation): string =>
	`${location.lat}, ${location.lng}, ${location.acc}, ${location.src}, ${location.ts.getTime()}`

const removeHidden = (state?: MapStateType) => (point: { src: string }) =>
	state?.disabledLocations?.includes?.(point.src as LocationSource) !== true
