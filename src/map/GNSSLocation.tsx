import { LoadingIndicator } from '#components/ValueLoading.js'
import { type Device } from '#context/Device.js'
import { useDeviceLocation } from '#context/DeviceLocation.js'
import { gnssEnabled } from '#context/DeviceState.js'
import { Located } from '#map/Map.js'
import { LocationSource } from '#map/LocationSourceLabels.js'

export const GNSSLocation = ({ device }: { device: Device }) => {
	const { locations } = useDeviceLocation()
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
			<p>
				Depending on your use-case scenario you can control whether to enable
				GNSS on this device:
			</p>
			{gnssEnabled() && (
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
