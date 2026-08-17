import { WaitingForDevice } from '#components/WaitingForDevice.tsx'
import { useDevice } from '#context/Device.tsx'
import { useMapState } from '#context/MapState.tsx'
import { encodeMapState } from '#map/encodeMapState.ts'
import { defaultMapState, Map } from '#map/Map.tsx'
import { ShrinkIcon } from 'lucide-preact'

import { UnsupportedDevice } from '#components/UnsupportedDevice.tsx'
import './DeviceMap.css'

export const DeviceMap = () => {
	const { device, unsupported } = useDevice()
	const mapState = useMapState()

	if (unsupported !== undefined)
		return (
			<div class="container">
				<div class="row">
					<div class="col my-4">
						<UnsupportedDevice />
					</div>
				</div>
			</div>
		)

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
