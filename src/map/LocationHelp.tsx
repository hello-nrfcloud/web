import { type Device } from '#context/Device.tsx'
import { CellularLocation } from '#map/CellularLocation.tsx'
import { GNSSLocation } from '#map/GNSSLocation.tsx'
import { NetworkLocation } from './NetworkLocation.tsx'

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
