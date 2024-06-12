import { useDeviceLocation } from '#context/DeviceLocation.js'
import { useMap } from '#context/Map.js'
import { RadioTowerIcon, SatelliteIcon, WifiIcon } from 'lucide-preact'
import maplibregl from 'maplibre-gl'
import {
	LocationSource,
	LocationSourceLabels,
} from '#map/LocationSourceLabels.js'
import { getPolygonCoordinatesForCircle } from '#map/geoJSONPolygonFromCircle.js'

import './CenterOnMapLocations.css'

export const CenterOnMapLocations = () => {
	const { map } = useMap()
	const { locations } = useDeviceLocation()
	const hasLocation = Object.values(locations).length > 0
	if (!hasLocation) return null
	return (
		<div class="mapLocations controls horizontal me-3 mt-2">
			{Object.values(locations).map(({ src, lat, lng, acc }) => (
				<button
					type="button"
					onClick={() => {
						if (map === undefined) return
						if (acc === undefined) return
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
					}}
					class="d-flex flex-row align-items-center control"
				>
					<span class="me-2">
						{[LocationSource.MCELL, LocationSource.SCELL].includes(
							src as LocationSource,
						) && <RadioTowerIcon />}
						{src === LocationSource.WIFI && <WifiIcon />}
						{src === LocationSource.GNSS && <SatelliteIcon />}
					</span>
					{LocationSourceLabels.has(src) && (
						<span>{LocationSourceLabels.get(src)}</span>
					)}
				</button>
			))}
		</div>
	)
}
