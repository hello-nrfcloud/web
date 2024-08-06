import {
	LockIcon,
	MinusIcon,
	MoonIcon,
	PlusIcon,
	SunIcon,
	UnlockIcon,
} from 'lucide-preact'
import { MapStyle, useMap } from '#context/Map.js'

export const MapZoomControls = ({ canBeLocked }: { canBeLocked?: boolean }) => {
	const { map, locked, toggleLock, style, setStyle } = useMap()
	return (
		<>
			<button
				type="button"
				class="control"
				title="Zoom in"
				onClick={() => {
					map?.setZoom(map.getZoom() + 1)
				}}
			>
				<PlusIcon />
			</button>
			<button
				type="button"
				class="control"
				title="Zoom out"
				onClick={() => {
					map?.setZoom(map.getZoom() - 1)
				}}
			>
				<MinusIcon />
			</button>
			{style == MapStyle.DARK ? (
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
