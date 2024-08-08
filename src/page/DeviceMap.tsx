import { WaitingForDevice } from '#components/WaitingForDevice.js'
import { useDevice } from '#context/Device.js'
import { useMapState } from '#context/MapState.js'
import { encodeMapState } from '#map/encodeMapState.js'
import { defaultMapState, Map } from '#map/Map.js'
import { ShrinkIcon } from 'lucide-preact'

import './DeviceMap.css'

export const DeviceMap = () => {
	const { device } = useDevice()
	const mapState = useMapState()

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
			<Map
				mapControls={
					<a
						href={
							mapState.state === undefined
								? '/device'
								: `/device#${encodeMapState(mapState.state)}`
						}
						class="button control"
						title={'Close fullscreen map'}
					>
						<ShrinkIcon />
					</a>
				}
				canBeLocked={false}
				key={mapState.state?.style ?? defaultMapState.style}
			/>
		</main>
	)
}
