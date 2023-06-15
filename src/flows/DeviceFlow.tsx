import type { Device } from '#context/Device.js'
import { GenericCellularFlow } from '#flows/GenericCellular.js'
import { SolarThingyFlow } from '#flows/SolarThingyFlow.js'

export const DeviceFlow = ({ device }: { device: Device }) => {
	if (device.type.model === 'PCA20035+solar') return <SolarThingyFlow />
	return <GenericCellularFlow device={device} />
}
