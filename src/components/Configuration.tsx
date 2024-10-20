import { Applied } from '#components/Applied.js'
import { Secondary, Transparent } from '#components/Buttons.js'
import { useDevice, type Device } from '#context/Device.js'
import { formatDistance } from '#utils/format.js'
import { Satellite, Settings2, UploadCloud, X } from 'lucide-preact'
import { useState } from 'preact/hooks'
import { ConfigureDevice } from './ConfigureDevice.js'

export const ShowDeviceConfiguration = ({ device }: { device: Device }) => {
	const {
		configuration: { reported, desired },
	} = useDevice()

	return (
		<table>
			<tr>
				<th>
					<UploadCloud class="me-1" strokeWidth={1} /> Publication Interval
				</th>
				<td class="ps-2">
					{formatDistance(
						desired?.updateIntervalSeconds ??
							reported?.updateIntervalSeconds ??
							device.model.defaultConfiguration.updateIntervalSeconds,
					)}
				</td>
				<td class="ps-2">
					{desired?.updateIntervalSeconds !== undefined && (
						<Applied
							desired={desired.updateIntervalSeconds}
							reported={
								reported?.updateIntervalSeconds ??
								device.model.defaultConfiguration.updateIntervalSeconds
							}
						/>
					)}
				</td>
			</tr>
			<tr>
				<th>
					<Satellite strokeWidth={1} class="me-1" /> GNSS
				</th>
				<td class="ps-2">
					{(desired?.gnssEnabled ??
					reported?.gnssEnabled ??
					device.model.defaultConfiguration.gnssEnabled) ? (
						<span>enabled</span>
					) : (
						<span>disabled</span>
					)}
				</td>
				<td class="ps-2">
					{desired?.gnssEnabled !== undefined && (
						<Applied
							desired={desired.gnssEnabled}
							reported={
								reported?.gnssEnabled ??
								device.model.defaultConfiguration.gnssEnabled
							}
						/>
					)}
				</td>
			</tr>
		</table>
	)
}

export const Configuration = ({ device }: { device: Device }) => {
	const [showConfiguration, setShowConfiguration] = useState<boolean>(false)

	return (
		<div id="device-configuration" class="scroll-margin">
			<h2 class="d-flex align-items-center justify-content-between">
				<span>Device configuration</span>
				{showConfiguration && (
					<Transparent
						class="text-muted"
						onClick={() => setShowConfiguration(false)}
					>
						<X />
					</Transparent>
				)}
			</h2>
			{showConfiguration ? (
				<ConfigureDevice device={device} />
			) : (
				<>
					<ShowDeviceConfiguration device={device} />
					<p class="mt-2">
						<Secondary onClick={() => setShowConfiguration(true)}>
							<Settings2 /> configure
						</Secondary>
					</p>
				</>
			)}
		</div>
	)
}
