import { LoadingIndicator } from '#components/ValueLoading.js'
import { useDevice, type Device } from '#context/Device.js'
import { Located } from '#map/Map.js'
import { LocationSource } from '#map/LocationSourceLabels.js'
import { useDeviceLocation } from '#context/DeviceLocation.js'

export const GNSSLocation = ({ device }: { device: Device }) => {
	const { locations } = useDeviceLocation()
	const { configuration } = useDevice()
	const gnssLocation = locations[LocationSource.GNSS]

	return (
		<>
			<h2>GNSS location</h2>
			<p>
				The integrated GNSS received of the {device.model.title} can provide
				precise geo location, however this comes at a cost. While the receiver
				is listening for GNSS signals, the LTE modem has to be turned off. If
				the device is indoors acquiring a GNSS fix might not be possible, and
				block the modem unnecessary long.
			</p>
			{(configuration.reported?.gnssEnabled ??
				device.model.defaultConfiguration.gnssEnabled) && (
				<>
					{gnssLocation !== undefined && <Located location={gnssLocation} />}
					{gnssLocation === undefined && (
						<p>
							<LoadingIndicator light height={60} width={'100%'} />
						</p>
					)}
				</>
			)}
		</>
	)
}
