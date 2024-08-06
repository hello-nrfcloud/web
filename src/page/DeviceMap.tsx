import { WaitingForDevice } from '#components/WaitingForDevice.js'
import { useDevice } from '#context/Device.js'
import { Map } from '#map/Map.js'
import { ShrinkIcon } from 'lucide-preact'
import { encodeMapState } from '#map/encodeMapState.js'
import { useMap } from '#context/Map.js'

import './DeviceMap.css'

export const DeviceMap = () => {
	const { device } = useDevice()
	const { map, style } = useMap()

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
							(document.location.href =
								map === undefined
									? `/device`
									: `/device#${encodeMapState(map, style)}`)
						}
						class="button control"
						title={'Close fullscreen map'}
					>
						<ShrinkIcon />
					</button>
				}
				canBeLocked={false}
				key={style}
			/>
		</main>
	)
}
