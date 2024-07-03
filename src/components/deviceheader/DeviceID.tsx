import { useDevice, type Device } from '#context/Device.js'
import { isDeviceInformation, toDeviceInformation } from '#proto/lwm2m.js'

export const DeviceID = ({ device }: { device: Device }) => {
	const { reported } = useDevice()

	return (
		<span>
			{Object.values(reported)
				.filter(isDeviceInformation)
				.map(toDeviceInformation)[0]?.imei ?? device.id}
		</span>
	)
}
