import { LockIcon, MinusIcon, PlusIcon, UnlockIcon } from 'lucide-preact'
import { useMap } from '#context/Map.js'

export const MapZoom = () => {
	const { map, locked, toggleLock } = useMap()
	return (
		<>
			<button
				type="button"
				title="Zoom in"
				onClick={() => {
					map?.setZoom(map.getZoom() + 1)
				}}
			>
				<PlusIcon />
			</button>
			<button
				type="button"
				title="Zoom out"
				onClick={() => {
					map?.setZoom(map.getZoom() - 1)
				}}
			>
				<MinusIcon />
			</button>
			<button
				type="button"
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
