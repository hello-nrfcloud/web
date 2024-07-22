import { useDeviceLocation } from '#context/DeviceLocation.js'
import { useMap } from '#context/Map.js'
import { RadioTowerIcon, SatelliteIcon, WifiIcon } from 'lucide-preact'
import {
	LocationSource,
	LocationSourceLabels,
} from '#map/LocationSourceLabels.js'

import './CenterOnMapLocations.css'

export const CenterOnMapLocations = () => {
	const { center } = useMap()
	const { locations } = useDeviceLocation()
	const hasLocation = Object.values(locations).length > 0
	if (!hasLocation) return null
	return (
		<div class="mapLocations controls horizontal me-3 mt-2">
			{Object.values(locations).map((location) => {
				const { src } = location
				return (
					<button
						type="button"
						onClick={() => {
							center(location)
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
				)
			})}
		</div>
	)
}