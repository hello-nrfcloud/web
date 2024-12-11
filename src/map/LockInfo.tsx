import { useMapState } from '#context/MapState.js'
import { UnlockIcon } from 'lucide-preact'

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
					<UnlockIcon />
				</button>{' '}
				to enable the map.
			</span>
		</div>
	)
}
