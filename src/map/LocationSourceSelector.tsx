import { useDeviceLocation } from '#context/DeviceLocation.js'
import { useMapState } from '#context/MapState.js'
import {
	LocationSource,
	LocationSourceLabels,
} from '#map/LocationSourceLabels.js'
import cx from 'classnames'
import {
	EyeOffIcon,
	RadioTowerIcon,
	SatelliteIcon,
	WifiIcon,
} from 'lucide-preact'

import './LocationSourceSelector.css'

export const LocationSourceSelector = () => {
	const { enableLocation, disableLocation, state } = useMapState()
	const { trail } = useDeviceLocation()

	const trailBySource = trail.reduce<Record<string, boolean>>(
		(acc, location) => {
			if (acc[location.src] === undefined) {
				acc[location.src] = true
			}
			return acc
		},
		{},
	)

	return (
		<div class="location-source-selector controls horizontal me-3 mt-2 d-flex flex-row ">
			{Object.keys(trailBySource).map((source) => {
				const src = source as LocationSource
				const enabled = !(state?.disabledLocations?.includes(src) ?? false)
				return (
					<button
						type="button"
						title={`${enabled ? 'Disable' : 'Enable'} ${LocationSourceLabels.get(src)}`}
						onClick={() => {
							if (enabled) {
								disableLocation(src)
							} else {
								enableLocation(src)
							}
						}}
						class={cx(`d-flex flex-row align-items-center control`, {
							disabled: !enabled,
						})}
					>
						{enabled && (
							<span>
								{[LocationSource.MCELL, LocationSource.SCELL].includes(src) && (
									<RadioTowerIcon />
								)}
								{src === LocationSource.WIFI && <WifiIcon />}
								{src === LocationSource.GNSS && <SatelliteIcon />}
							</span>
						)}
						{!enabled && <EyeOffIcon />}
						{LocationSourceLabels.has(src) && (
							<span class="ms-2 label">{LocationSourceLabels.get(src)}</span>
						)}
					</button>
				)
			})}
		</div>
	)
}
