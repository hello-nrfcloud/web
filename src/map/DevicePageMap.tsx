import { Provider as MapProvider } from '#context/Map.js'
import { Map } from '#map/Map.js'
import { ExpandIcon } from 'lucide-preact'

export const DevicePageMap = () => (
	<MapProvider>
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
	</MapProvider>
)
