import { LoadingIndicator } from '#components/ValueLoading.js'
import { useDevice, type Device } from '#context/Device.js'
import { useDeviceLocation } from '#context/DeviceLocation.js'
import { LocationSource } from '#map/LocationSourceLabels.js'
import { Located } from './Located.js'

export const GNSSLocation = ({ device }: { device: Device }) => {
	const { locations } = useDeviceLocation()
	const {
		configuration: { desired, reported },
	} = useDevice()
	const gnssLocation = locations[LocationSource.GNSS]

	const gnssEnabled =
		desired?.gnssEnabled ??
		reported?.gnssEnabled ??
		device.model.defaultConfiguration.gnssEnabled

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
			{gnssEnabled && (
				<>
					{gnssLocation !== undefined && <Located location={gnssLocation} />}
					{gnssLocation === undefined && (
						<p>
							<LoadingIndicator light height={60} width={'100%'} />
						</p>
					)}
					<p>
						GNSS location has been enabled. You can disable it using the{' '}
						<a href="#device-configuration">device configuration</a> section
						below.
					</p>
				</>
			)}
			{!gnssEnabled && (
				<p>
					GNSS location has been disabled. You can enable it using the{' '}
					<a href="#device-configuration">device configuration</a> section
					below.
				</p>
			)}
		</>
	)
}
