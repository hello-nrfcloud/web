import type { DK, Device } from '@context/Device'
import { GenericCellularFlow } from '@flows/GenericCellular'
import { SolarThingyFlow } from '@flows/SolarThingyFlow'

export const DeviceFlow = ({ device, type }: { device: Device; type: DK }) => {
	if (type.model === 'PCA20035+solar')
		return <SolarThingyFlow device={device} />
	return <GenericCellularFlow device={device} />
}
