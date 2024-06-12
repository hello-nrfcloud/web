import { LockIcon } from 'lucide-preact'
import { useMap } from '#context/Map.js'

export const LockInfo = () => {
	const { locked, unlock } = useMap()
	if (!locked) return null
	return (
		<div class="lockInfo">
			<span>
				Click the{' '}
				<button
					type="button"
					onClick={() => {
						unlock()
					}}
				>
					<LockIcon />
				</button>{' '}
				to enable the map.
			</span>
		</div>
	)
}
