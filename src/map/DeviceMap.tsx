import { useMapState } from '#context/MapState.tsx'
import { defaultMapState, Map } from '#map/Map.tsx'
import { ExpandIcon } from 'lucide-preact'
import { encodeMapState } from './encodeMapState.ts'

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
