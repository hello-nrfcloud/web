import type { DK } from '@context/DKs'
import type { Device } from '@context/Device'
import { GenericCellularFlow } from '@flows/GenericCellular'
import { SolarThingyFlow } from '@flows/SolarThingyFlow'

export const DeviceFlow = ({ device, type }: { device: Device; type: DK }) => {
	if (type.model === 'PCA20035+solar') return <SolarThingyFlow />
	return <GenericCellularFlow device={device} />
}
