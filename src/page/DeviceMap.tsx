import { WaitingForDevice } from '#components/WaitingForDevice.js'
import { useDevice } from '#context/Device.js'
import { Map } from '#map/Map.js'
import { ShrinkIcon } from 'lucide-preact'
import { encodeMapState } from '#map/encodeMapState.js'
import { useMap } from '#context/Map.js'

import './DeviceMap.css'

export const DeviceMap = () => {
	const { device } = useDevice()
	const { map } = useMap()

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
					<button
						onClick={() =>
							(window.location.href =
								map === undefined
									? `/device`
									: `/device#${encodeMapState(map)}`)
						}
						class="button control"
						title={'Close fullscreen map'}
					>
						<ShrinkIcon />
					</button>
				}
				canBeLocked={false}
			/>
		</main>
	)
}
