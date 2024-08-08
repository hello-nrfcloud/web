import { useMapState } from '#context/MapState.js'
import { MapStyle } from '#map/encodeMapState.js'
import {
	LockIcon,
	MinusIcon,
	MoonIcon,
	PlusIcon,
	SunIcon,
	UnlockIcon,
} from 'lucide-preact'
import type maplibregl from 'maplibre-gl'
import { defaultMapState } from './Map.js'

export const MapZoomControls = ({
	canBeLocked,
	map,
}: {
	canBeLocked?: boolean
	map: maplibregl.Map
}) => {
	const { toggleLock, setStyle, state, locked } = useMapState()
	return (
		<>
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
