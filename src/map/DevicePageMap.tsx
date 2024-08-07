import { useMapState } from '#context/MapState.js'
import { Map } from '#map/Map.js'
import { ExpandIcon } from 'lucide-preact'
import { encodeMapState } from './encodeMapState.js'

export const DevicePageMap = () => {
	const mapState = useMapState()
	return (
		<Map
			mapControls={
				<a
					href={`/device/map#${encodeMapState(mapState.state)}`}
					class="button control"
					title={'Show fullscreen map'}
				>
					<ExpandIcon />
				</a>
			}
			key={mapState.state.style}
		/>
	)
}
