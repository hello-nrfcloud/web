import { type Device } from '#context/Device.js'
import { CellularLocation } from '#map/CellularLocation.js'
import { GNSSLocation } from '#map/GNSSLocation.js'
import { NetworkLocation } from './NetworkLocation.js'

export const LocationHelp = ({
	device,
	class: className,
}: {
	class?: string
	device: Device
}) => (
	<div class={className}>
		<div class="mb-2">
			<GNSSLocation device={device} />
		</div>
		<div class="mb-2">
			<NetworkLocation />
		</div>
		<div class="mb-2">
			<CellularLocation />
		</div>
	</div>
)
