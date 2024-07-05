import { Map } from '#map/Map.js'
import { ExpandIcon } from 'lucide-preact'

export const DevicePageMap = () => (
	<Map
		mapControls={
			<>
				<a
					href="/device/map"
					class="button control"
					title={'Show fullscreen map'}
				>
					<ExpandIcon />
				</a>
			</>
		}
	/>
)
