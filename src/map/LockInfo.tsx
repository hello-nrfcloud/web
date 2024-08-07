import { LockIcon } from 'lucide-preact'
import { useMapState } from '#context/MapState.js'

export const LockInfo = () => {
	const mapState = useMapState()
	if (!mapState.locked) return null
	return (
		<div class="lockInfo">
			<span>
				Click the{' '}
				<button
					type="button"
					onClick={() => {
						mapState.unlock()
					}}
				>
					<LockIcon />
				</button>{' '}
				to enable the map.
			</span>
		</div>
	)
}
