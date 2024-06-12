import { LockIcon, MinusIcon, PlusIcon, UnlockIcon } from 'lucide-preact'
import { useMap } from '#context/Map.js'

export const MapZoomControls = () => {
	const { map, locked, toggleLock } = useMap()
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
		</>
	)
}
