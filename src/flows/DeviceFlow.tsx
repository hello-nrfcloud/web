import type { DK } from '#context/DKs.js'
import type { Device } from '#context/Device.js'
import { GenericCellularFlow } from '#flows/GenericCellular.js'
import { SolarThingyFlow } from '#flows/SolarThingyFlow.js'

export const DeviceFlow = ({ device, type }: { device: Device; type: DK }) => {
	if (type.model === 'PCA20035+solar') return <SolarThingyFlow />
	return <GenericCellularFlow device={device} />
}
