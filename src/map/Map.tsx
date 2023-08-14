import {
	LockIcon,
	MapPinOff,
	MinusIcon,
	PlusIcon,
	RadioTowerIcon,
	SatelliteIcon,
	UnlockIcon,
} from 'lucide-preact'
// Needed for SSR build, named exports don't work
import { CountryFlag } from '#components/CountryFlag.js'
import { LoadingIndicator } from '#components/ValueLoading.js'
import { mccmnc2country } from '#components/mccmnc2country.js'
import { type Device } from '#context/Device.js'
import { useDeviceLocation, type Locations } from '#context/DeviceLocation.js'
import { useDeviceState } from '#context/DeviceState.js'
import { useParameters } from '#context/Parameters.js'
import { GNSSLocation } from '#map/GNSSLocation.js'
import {
	Location,
	LocationSource,
} from '@hello.nrfcloud.com/proto/hello/model/PCA20035+solar'
import type { Static } from '@sinclair/typebox'
import { formatDistanceToNow } from 'date-fns'
import maplibregl, { type GeoJSONSourceSpecification } from 'maplibre-gl'
import { useEffect, useRef, useState } from 'preact/hooks'
import '#map/Map.css'
import {
	geoJSONPolygonFromCircle,
	getPolygonCoordinatesForCircle,
} from '#map/geoJSONPolygonFromCircle.js'
import { mapStyle } from '#map/style.js'
import { transformRequest } from '#map/transformRequest.js'
import { CellularLocation } from '#map/CellularLocation.js'
import { timeSpans } from '#chart/timeSpans.js'
import { DateRangeButton } from '#chart/DateRangeButton.js'

// Source: https://coolors.co/palette/22577a-38a3a5-57cc99-80ed99-c7f9cc
export const locationSourceColors = {
	[LocationSource.GNSS]: '#C7F9CC',
	[LocationSource.WIFI]: '#80ed99',
	[LocationSource.MCELL]: '#57cc99',
	[LocationSource.SCELL]: '#38a3a5',
} as const

const trailColor = '#e169a5'

// Uses nrfcloud.com wording
export const LocationSourceLabels = {
	// [LocationSource.GNSS]: 'GNSS',
	[LocationSource.WIFI]: 'Wi-Fi',
	[LocationSource.MCELL]: 'multi-cell',
	[LocationSource.SCELL]: 'single-cell',
	[LocationSource.GNSS]: 'GNSS',
}

// See https://docs.aws.amazon.com/location/latest/developerguide/esri.html for available fonts
const glyphFonts = {
	regular: 'Ubuntu Regular',
	bold: 'Ubuntu Medium',
} as const

const getCenter = (locations: Locations): Static<typeof Location> | undefined =>
	Object.values(locations).sort(({ ts: ts1 }, { ts: ts2 }) => ts2 - ts1)[0]

export const Map = ({ device }: { device: Device }) => {
	const { onParameters } = useParameters()
	const containerRef = useRef<HTMLDivElement>(null)
	const { locations, trail, timeSpan, setTimeSpan } = useDeviceLocation()
	const [map, setMap] = useState<maplibregl.Map>()
	const [locked, setLocked] = useState<boolean>(true)
	const hasLocation = Object.values(locations).length > 0
	const hasTrail = trail.length > 1 // Only show trail with more than one point

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

			setMap(map)
		})

		return () => {
			map?.remove()
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
		if (!hasTrail) return
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
		if (device === undefined) return

		const layerIds: string[] = []
		const sourceIds: string[] = []

		for (const location of Object.values(locations)) {
			const { lng, lat, acc, src, ts } = location
			const locationCenterSourceId = `${location.src}-source-center`
			const locationAreaSourceId = `${location.src}-location-area-source`
			const locationAreaLayerId = `${location.src}-location-area-layer`
			const locationAreaLabelId = `${location.src}-location-area-label`
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
						'text-field': LocationSourceLabels[src],
						'text-font': [glyphFonts.bold],
						'text-offset': [0, 0],
					},
					paint: {
						'text-color': locationSourceColors[src],
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
						'text-color': locationSourceColors[src],
						'text-halo-color': '#222222',
						'text-halo-width': 1,
						'text-halo-blur': 1,
					},
				})
				layerIds.push(locationAgeLabel)
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
						'line-color': locationSourceColors[src],
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
						'text-color': locationSourceColors[src],
						'text-halo-color': '#222222',
						'text-halo-width': 1,
						'text-halo-blur': 1,
					},
				})
				layerIds.push(locationAreaLabelId)
			}
		}
		return () => {
			layerIds.map((id) => map.removeLayer(id))
			sourceIds.map((id) => map.removeSource(id))
		}
	}, [locations, map, device])

	// Trail
	useEffect(() => {
		if (!hasTrail) return
		if (map === undefined) return
		if (device === undefined) return

		const layerIds: string[] = []
		const sourceIds: string[] = []

		for (const point of trail) {
			const { lng, lat, ts, count } = point
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
						'text-field': `${formatDistanceToNow(ts, { addSuffix: true })} ${
							count > 1 ? `${count} positions` : ''
						}`,
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
	}, [trail, map, device])

	const scellLocation = locations[LocationSource.SCELL]
	const mcellLocation = locations[LocationSource.MCELL]
	const cellularLocations: Static<typeof Location>[] = []
	if (scellLocation !== undefined) cellularLocations.push(scellLocation)
	if (mcellLocation !== undefined) cellularLocations.push(mcellLocation)

	return (
		<>
			<section class="map bg-dark">
				<div id="map" ref={containerRef} />

				{!hasLocation && locked && (
					<div class="noLocationInfo">
						<span>
							<MapPinOff /> waiting for location
						</span>
					</div>
				)}
				{map !== undefined && (
					<MapZoom map={map} locked={locked} onLock={setLocked} />
				)}
				<div class="mapControls">
					{hasLocation && (
						<div class="mapLocations">
							{Object.values(locations).map(({ src, lat, lng, acc }) => (
								<button
									type="button"
									onClick={() => {
										if (map === undefined) return
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
											new maplibregl.LngLatBounds(
												coordinates[0],
												coordinates[0],
											),
										)
										map.fitBounds(bounds, {
											padding: 20,
										})
									}}
									class="d-flex flex-row align-items-center"
								>
									<span class="me-2">
										{[LocationSource.MCELL, LocationSource.SCELL].includes(
											src,
										) && <RadioTowerIcon />}
										{src === LocationSource.GNSS && <SatelliteIcon />}
									</span>
									<span>{LocationSourceLabels[src]}</span>
								</button>
							))}
						</div>
					)}
				</div>
			</section>
			<div
				class={'bg-dark'}
				style={{
					color: '#ccc',
				}}
			>
				<div class="container py-4">
					<div class="row mb-4">
						<div class="col d-flex justify-content-start align-items-center">
							<span class="me-2 opacity-75">Location history:</span>
							{timeSpans.map(({ id, title }) => (
								<DateRangeButton
									class="ms-1"
									disabled={id === timeSpan}
									onClick={() => {
										setTimeSpan(id)
									}}
									label={title}
									active={timeSpan === id}
								/>
							))}
						</div>
					</div>
					<div class="row mb-2">
						<div class="col">
							<GNSSLocation device={device} />
						</div>
					</div>
					<div class="row mb-2">
						<div class="col">
							<NetworkLocation />
						</div>
					</div>
					<div class="row">
						<div class="col">
							<CellularLocation />
						</div>
					</div>
				</div>
			</div>
		</>
	)
}

const NetworkLocation = () => {
	const { state } = useDeviceState()
	const mccmnc = state?.device?.networkInfo?.mccmnc
	const country =
		mccmnc === undefined ? undefined : mccmnc2country(mccmnc)?.name
	if (mccmnc === undefined || country === undefined)
		return (
			<>
				<h2>
					Network location <LoadingIndicator light width={20} height={15} />
				</h2>
				<p>
					Based on the network your device is connected to, it can be coarsely
					located in a country right after it connected.
				</p>
			</>
		)
	return (
		<>
			<h2>Network location: {<CountryFlag mccmnc={mccmnc} />}</h2>
			<p>
				Based on the network code (<code>{mccmnc}</code>) your device is
				registered to, it can be coarsely located in {country}.
			</p>
		</>
	)
}

const MapZoom = ({
	map,
	locked,
	onLock,
}: {
	map: maplibregl.Map
	locked: boolean
	onLock: (setter: (current: boolean) => boolean) => void
}) => {
	useEffect(() => {
		if (locked) {
			map.dragPan.disable()
		} else {
			map.dragPan.enable()
		}
	}, [locked])

	return (
		<>
			{locked && (
				<div class="lockInfo">
					<span>
						Click the{' '}
						<button
							type="button"
							onClick={() => {
								onLock(() => false)
							}}
						>
							<UnlockIcon />
						</button>{' '}
						to enable the map.
					</span>
				</div>
			)}
			<div class="mapZoom">
				<button
					type="button"
					onClick={() => {
						map.setZoom(map.getZoom() + 1)
					}}
				>
					<PlusIcon />
				</button>
				<button
					type="button"
					onClick={() => {
						map.setZoom(map.getZoom() - 1)
					}}
				>
					<MinusIcon />
				</button>
				<button
					type="button"
					onClick={() => {
						onLock((locked) => !locked)
					}}
				>
					{locked ? <UnlockIcon /> : <LockIcon />}
				</button>
			</div>
		</>
	)
}

export const Located = ({
	location,
}: {
	location: Static<typeof Location>
}) => (
	<p>
		Using {LocationSourceLabels[location.src]}, the location was determined to
		be{' '}
		<a
			href={`https://google.com/maps/search/${location.lat},${location.lng}`}
			target="_blank"
			class="text-light"
		>
			{location.lat.toFixed(5).replace(/0+$/, '')},{' '}
			{location.lng.toFixed(5).replace(/0+$/, '')}
		</a>{' '}
		with an accuracy of {Math.round(location.acc)} m.
	</p>
)

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
	},
})
