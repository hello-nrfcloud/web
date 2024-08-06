import { Map } from '#map/Map.js'
import { ExpandIcon } from 'lucide-preact'
import { encodeMapState } from './encodeMapState.js'
import { useMap } from '#context/Map.js'

export const DevicePageMap = () => {
	const { map } = useMap()

	return (
		<Map
			mapControls={
				<button
					onClick={() =>
						(window.location.href =
							map === undefined
								? `/device/map`
								: `/device/map#${encodeMapState(map)}`)
					}
					class="button control"
					title={'Show fullscreen map'}
				>
					<ExpandIcon />
				</button>
			}
		/>
	)
}
