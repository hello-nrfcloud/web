import { useMapState } from '#context/MapState.js'
import { defaultMapState, Map } from '#map/Map.js'
import { ExpandIcon } from 'lucide-preact'
import { encodeMapState } from './encodeMapState.js'

export const DeviceMap = () => {
	const mapState = useMapState()
	return (
		<Map
			mapControls={
				<a
					href={
						mapState.state !== undefined
							? `/device/map#${encodeMapState(mapState.state)}`
							: `/device/map`
					}
					class="button control"
					title={'Show fullscreen map'}
				>
					<ExpandIcon />
				</a>
			}
			key={mapState.state?.style ?? defaultMapState.style}
		/>
	)
}
