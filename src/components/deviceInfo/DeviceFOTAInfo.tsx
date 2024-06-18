import { useDevice, type Device } from '#context/Device.js'
import { isNRFCloudServiceInfo, toNRFCloudServiceInfo } from '#proto/lwm2m.js'
import { FOTAJobs } from './FOTAJobs.js'
import { SoftwareInfo } from './SoftwareInfo.js'

export const DeviceFOTAInfo = ({ device }: { device: Device }) => {
	const { reported } = useDevice()

	const serviceInfo = Object.values(reported)
		.filter(isNRFCloudServiceInfo)
		.map(toNRFCloudServiceInfo)[0]
	const fwTypes = serviceInfo?.fwTypes ?? []

	return (
		<>
			<h2>Firmware update over the air (FOTA)</h2>
			{fwTypes.length === 0 && (
				<div class="alert alert-warning">
					<p>The firmware running on this device does not support FOTA.</p>
				</div>
			)}
			{fwTypes.length > 0 && (
				<>
					<h3>Supported firmware types</h3>
					<ul>
						{fwTypes.map((type) => (
							<li>
								<code>{type}</code>
							</li>
						))}
					</ul>
				</>
			)}

			<SoftwareInfo device={device} />
			<FOTAJobs />
		</>
	)
}
