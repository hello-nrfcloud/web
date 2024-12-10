import { useDeviceLocation } from '#context/DeviceLocation.js'
import { useMapState } from '#context/MapState.js'
import { MapStyle } from '#map/encodeMapState.js'
import {
	BlendIcon,
	HexagonIcon,
	LockIcon,
	MinusIcon,
	MoonIcon,
	PlusIcon,
	SatelliteIcon,
	SunIcon,
	UnlockIcon,
	WifiIcon,
} from 'lucide-preact'
import type maplibregl from 'maplibre-gl'
import { centerMapOnLocation } from './centerMapOnLocation.js'
import { LocationSource, LocationSourceLabels } from './LocationSourceLabels.js'
import { defaultMapState } from './Map.js'

export const MapZoomControls = ({
	canBeLocked,
	map,
}: {
	canBeLocked?: boolean
	map: maplibregl.Map
}) => {
	const { toggleLock, setStyle, state, locked } = useMapState()
	const { locations } = useDeviceLocation()
	return (
		<>
			{[
				LocationSource.GNSS,
				LocationSource.WIFI,
				LocationSource.MCELL,
				LocationSource.SCELL,
			].map((src) => {
				const disabled =
					locations[src] === undefined ||
					state?.disabledLocations?.includes(src)
				return (
					<button
						type="button"
						onClick={() => {
							if (map === undefined) return
							const location = locations[src]
							if (location === undefined) return
							centerMapOnLocation(map, location)
						}}
						class="control"
						title={`Center on ${LocationSourceLabels.get(src)} location`}
						disabled={disabled}
					>
						{src === LocationSource.SCELL && <HexagonIcon />}
						{src === LocationSource.MCELL && <BlendIcon />}
						{src === LocationSource.WIFI && <WifiIcon />}
						{src === LocationSource.GNSS && <SatelliteIcon />}
					</button>
				)
			})}
			<button
				type="button"
				class="control"
				title="Zoom in"
				onClick={() => {
					map.setZoom(map.getZoom() + 1)
				}}
			>
				<PlusIcon />
			</button>
			<button
				type="button"
				class="control"
				title="Zoom out"
				onClick={() => {
					map.setZoom(map.getZoom() - 1)
				}}
			>
				<MinusIcon />
			</button>
			{(state?.style ?? defaultMapState.style) == MapStyle.DARK ? (
				<button
					type="button"
					class="control"
					title="Switch to light mode"
					onClick={() => {
						setStyle(MapStyle.LIGHT)
					}}
				>
					<MoonIcon />
				</button>
			) : (
				<button
					type="button"
					class="control"
					title="Switch to dark mode"
					onClick={() => {
						setStyle(MapStyle.DARK)
					}}
				>
					<SunIcon />
				</button>
			)}
			{(canBeLocked ?? true) && (
				<button
					type="button"
					class="control"
					title="Lock map"
					onClick={() => {
						toggleLock()
					}}
				>
					{locked ? <LockIcon /> : <UnlockIcon />}
				</button>
			)}
		</>
	)
}
