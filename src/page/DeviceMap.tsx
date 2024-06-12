import { WaitingForDevice } from '#components/WaitingForDevice.js'
import { useDevice } from '#context/Device.js'
import { Provider as MapProvider } from '#context/Map.js'
import { Map } from '#map/Map.js'
import { ShrinkIcon } from 'lucide-preact'

import './DeviceMap.css'

export const DeviceMap = () => {
	const { device } = useDevice()

	if (device === undefined)
		return (
			<div class="container">
				<div class="row">
					<div class="col my-4">
						<WaitingForDevice />
					</div>
				</div>
			</div>
		)

	return (
		<main id="deviceMap">
			<MapProvider>
				<Map
					mapControls={
						<>
							<a
								href="/device"
								class="button control"
								title={'Close fullscreen map'}
							>
								<ShrinkIcon />
							</a>
						</>
					}
				/>
			</MapProvider>
		</main>
	)
}
