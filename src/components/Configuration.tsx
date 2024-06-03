import { Applied } from '#components/Applied.js'
import { Secondary, Transparent } from '#components/Buttons.js'
import { useDevice, type Device } from '#context/Device.js'
import { Satellite, Settings2, UploadCloud, X } from 'lucide-preact'
import { useState } from 'preact/hooks'
import { ConfigureDevice } from './ConfigureDevice.js'
import { formatDistance } from '#utils/format.js'

export const PublicationInterval = ({ device }: { device: Device }) => {
	const {
		configuration: { reported, desired },
	} = useDevice()

	return (
		<div class="d-flex flex-column">
			<small class="text-muted">
				<strong>Publication interval</strong>
			</small>
			<span>
				<UploadCloud strokeWidth={1} />{' '}
				{formatDistance(
					reported?.updateIntervalSeconds ??
						device.model.defaultConfiguration.updateIntervalSeconds,
				)}{' '}
				{(reported?.gnssEnabled ??
					device.model.defaultConfiguration.gnssEnabled) && (
					<Satellite strokeWidth={1} class="ms-1" />
				)}
			</span>
			{desired?.updateIntervalSeconds !== undefined && (
				<Applied
					desired={desired.updateIntervalSeconds}
					reported={
						reported?.updateIntervalSeconds ??
						device.model.defaultConfiguration.updateIntervalSeconds
					}
				/>
			)}
		</div>
	)
}

export const Configuration = ({ device }: { device: Device }) => {
	const [showConfiguration, setShowConfiguration] = useState<boolean>(false)

	return (
		<div id="device-configuration" class="mt-4">
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
				<div class="d-flex justify-content-between">
					<PublicationInterval device={device} />
					<Secondary onClick={() => setShowConfiguration(true)}>
						<Settings2 /> configure
					</Secondary>
				</div>
			)}
		</div>
	)
}
