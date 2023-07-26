import {
	LockIcon,
	MapPinOff,
	MinusIcon,
	PlusIcon,
	UnlockIcon,
} from 'lucide-preact'
// Needed for SSR build, named exports don't work
import { CountryFlag } from '#components/CountryFlag.js'
import { LoadingIndicator } from '#components/ValueLoading.js'
import { mccmnc2country } from '#components/mccmnc2country.js'
import { type Device } from '#context/Device.js'
import { useDeviceLocation } from '#context/DeviceLocation.js'
import { useDeviceState } from '#context/DeviceState.js'
import { useParameters } from '#context/Parameters.js'
import { LocationSource } from '@hello.nrfcloud.com/proto/hello'
import maplibregl from 'maplibre-gl'
import { useEffect, useRef, useState } from 'preact/hooks'
import './Map.css'
import { geoJSONPolygonFromCircle } from './geoJSONPolygonFromCircle.js'
import { mapStyle } from './style.js'
import { transformRequest } from './transformRequest.js'
import { GNSSLocation } from '#map/GNSSLocation.js'

// Source: https://coolors.co/palette/22577a-38a3a5-57cc99-80ed99-c7f9cc
export const locationSourceColors = {
	// [LocationSource.GNSS]: '#C7F9CC',
	[LocationSource.WIFI]: '#80ed99',
	[LocationSource.MCELL]: '#57cc99',
	[LocationSource.SCELL]: '#38a3a5',
} as const

// Uses nrfcloud.com wording
export const LocationSourceLabels = {
	// [LocationSource.GNSS]: 'GNSS',
	[LocationSource.WIFI]: 'Wi-Fi',
	[LocationSource.MCELL]: 'multi-cell',
	[LocationSource.SCELL]: 'single-cell',
}

// See https://docs.aws.amazon.com/location/latest/developerguide/esri.html for available fonts
const glyphFonts = {
	regular: 'Ubuntu Regular',
	bold: 'Ubuntu Medium',
} as const

export const Map = ({ device }: { device: Device }) => {
	const { onParameters } = useParameters()
	const containerRef = useRef<HTMLDivElement>(null)
	const { location } = useDeviceLocation()
	const [map, setMap] = useState<maplibregl.Map>()

	useEffect(() => {
		if (containerRef.current === null) return
		onParameters(({ mapRegion, mapName, mapApiKey }) => {
			const map = new maplibregl.Map({
				container: 'map',
				style: mapStyle({
					region: mapRegion,
					mapName,
				}),
				center: [10.437581513483195, 63.42148461054351],
				zoom: 12,
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

	useEffect(() => {
		if (location === undefined) return
		if (map === undefined) return
		if (device === undefined) return
		console.log(`[Map]`, location)
		const centerSourceId = `${device.id}-center-source`
		const locationAreaSourceId = `${device.id}-location-area-source`
		const locationAreaLayerId = `${device.id}-location-area-layer`
		const locationAreaLabelId = `${device.id}-location-area-label`
		const centerLabelId = `${device.id}-center-label`
		const centerSource = map.getSource(centerSourceId)
		map.flyTo({
			center: location,
			zoom: map.getZoom(),
		})

		if (centerSource === undefined) {
			const { lng, lat, acc, src } = location
			// Data for Center point
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
			// Data for Hexagon
			map.addSource(
				locationAreaSourceId,
				geoJSONPolygonFromCircle([lng, lat], acc, 6, Math.PI / 2),
			)
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
			// Render location source in center
			map.addLayer({
				id: centerLabelId,
				type: 'symbol',
				source: centerSourceId,
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
		}

		return () => {
			map.removeLayer(locationAreaLayerId)
			map.removeLayer(centerLabelId)
			map.removeLayer(locationAreaLabelId)
			map.removeSource(centerSourceId)
			map.removeSource(locationAreaSourceId)
		}
	}, [location, map, device])

	return (
		<>
			<section class="map">
				<div id="map" ref={containerRef} />
				{location === undefined && (
					<div class="noLocation">
						<MapPinOff strokeWidth={1} style={{ zoom: 2 }} /> waiting for
						location
					</div>
				)}
				{location !== undefined && map !== undefined && <MapZoom map={map} />}
			</section>
			<div
				style={{
					backgroundColor: 'var(--color-nordic-dark-grey)',
					color: '#ccc',
				}}
			>
				<div class="container py-4">
					<div class="row">
						<div class="col">
							<GNSSLocation device={device} />
						</div>
					</div>
					<div class="row">
						<div class="col">
							<NetworkLocation />
						</div>
					</div>
					<div class="row">
						<div class="col">
							<h2>Device location</h2>

							{location === undefined && (
								<p>
									<LoadingIndicator light height={60} />
								</p>
							)}
							{location !== undefined && (
								<>
									<p>
										Using {LocationSourceLabels[location.src]}, the location was
										determined to be{' '}
										<a
											href={`https://google.com/maps/search/${location.lat},${location.lng}`}
											target="_blank"
											class="text-light"
										>
											{location.lat}, {location.lng}
										</a>{' '}
										with an accuracy of {location.acc} m.
									</p>
								</>
							)}
							<p>
								A more precise device located can be determined using{' '}
								<a
									href="https://www.nordicsemi.com/Products/Cloud-services"
									target="_blank"
									class="text-light"
								>
									nRF Cloud Location services
								</a>{' '}
								based on the device scanning the network and reporting
								neighboring cell information and Wi-Fi access points it can
								detect and reporting this information to the cloud.
							</p>
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

const MapZoom = ({ map }: { map: maplibregl.Map }) => {
	const [locked, setLocked] = useState<boolean>(true)

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
				<div class="dragCatcher">
					<span>
						Click the{' '}
						<button
							type="button"
							onClick={() => {
								setLocked(false)
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
						setLocked((locked) => !locked)
					}}
				>
					{locked ? <UnlockIcon /> : <LockIcon />}
				</button>
			</div>
		</>
	)
}
