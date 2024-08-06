import { Map } from '#map/Map.js'
import { ExpandIcon } from 'lucide-preact'
import { encodeMapState } from './encodeMapState.js'
import { useMap } from '#context/Map.js'

export const DevicePageMap = () => {
	const { map, style } = useMap()

	return (
		<Map
			mapControls={
				<button
					onClick={() =>
						(document.location.href =
							map === undefined
								? `/device/map`
								: `/device/map#${encodeMapState(map, style)}`)
					}
					class="button control"
					title={'Show fullscreen map'}
				>
					<ExpandIcon />
				</button>
			}
			key={style}
		/>
	)
}
