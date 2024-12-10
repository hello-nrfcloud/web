import { useDeviceLocation } from '#context/DeviceLocation.js'
import { useMapState } from '#context/MapState.js'
import {
	LocationSource,
	LocationSourceLabels,
} from '#map/LocationSourceLabels.js'
import cx from 'classnames'
import {
	BlendIcon,
	EyeOffIcon,
	HexagonIcon,
	SatelliteIcon,
	WifiIcon,
} from 'lucide-preact'

import './LocationSourceSelector.css'

export const LocationSourceSelector = () => {
	const { enableLocation, disableLocation, state } = useMapState()
	const { locations } = useDeviceLocation()
	return (
		<div class="location-source-selector controls horizontal me-3 mt-2 d-flex flex-row ">
			{[
				LocationSource.GNSS,
				LocationSource.WIFI,
				LocationSource.MCELL,
				LocationSource.SCELL,
			].map((src) => {
				const disabled =
					locations[src] === undefined ||
					(state?.disabledLocations?.includes(src) ?? false)
				const enabled = !disabled
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
								{src === LocationSource.SCELL && <HexagonIcon />}
								{src === LocationSource.MCELL && <BlendIcon />}
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
