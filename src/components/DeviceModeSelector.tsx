import { useDeviceState } from '#context/DeviceState.js'
import { HistoryIcon, UploadCloud, X } from 'lucide-preact'
import { SIMIcon } from './icons/SIMIcon.js'
import { Secondary, Transparent } from './Buttons.js'
import { useDevice, type Device } from '#context/Device.js'
import type { Static } from '@sinclair/typebox'
import { ConfigureDevice, Context } from '@hello.nrfcloud.com/proto/hello'
import { Applied } from './Applied.js'

const LOW_POWER_INTERVAL = 3600
const INTERACTIVE_INTERVAL = 120

export const DeviceModeSelector = ({
	device,
	onClose,
	onInterval,
}: {
	device: Device
	onClose?: () => void
	onInterval?: (interval: number) => void
}) => {
	const { state, updateConfig, desiredConfig } = useDeviceState()
	const updateIntervalSeconds = state?.config?.activeWaitTime ?? 120
	const { send } = useDevice()

	const setUpdateInterval = (interval: number) => {
		const configureDevice: Static<typeof ConfigureDevice> = {
			'@context': Context.configureDevice.toString(),
			id: device.id,
			configuration: {
				updateIntervalSeconds: interval,
			},
		}
		updateConfig({
			activeWaitTime: interval,
		})
		send?.(configureDevice)
		onInterval?.(interval)
	}

	return (
		<div class="container">
			<div class="row">
				<div class="col-12">
					<h2 class="d-flex align-items-center justify-content-between">
						<span>
							<UploadCloud strokeWidth={1} /> Publication interval
						</span>
						<Transparent class="text-muted" onClick={onClose}>
							<X />
						</Transparent>
					</h2>
				</div>
			</div>
			<div class="row mb-4">
				<div class="col-12 col-lg-4">
					<p class={'text-secondary'}>
						Currently, the device is configured to publish data every{' '}
						{updateIntervalSeconds} seconds.
					</p>
					<p>
						The power consumption and data usage is greatly influenced by how
						often the device sends data to the cloud.
					</p>
					<p>
						Change the mode in order to preserve battery and reduce the data
						usage.
					</p>
				</div>
				<div class="col-12 col-lg-4">
					<h3>Interactive mode</h3>
					<p class="mb-1 d-flex">
						<HistoryIcon strokeWidth={1} class="me-2 flex-shrink-0" />
						<small>
							In this mode, the device sends data to the cloud every{' '}
							{INTERACTIVE_INTERVAL}
							seconds.
						</small>
					</p>
					<p class="mb-1 d-flex">
						<SIMIcon class="me-2 flex-shrink-0" size={18} />
						<small>This mode uses around 1.5 MB of data per day.</small>
					</p>
					<p class="d-flex align-items-center">
						<Secondary
							onClick={() => {
								setUpdateInterval(INTERACTIVE_INTERVAL)
							}}
						>
							apply configuration
						</Secondary>
						{desiredConfig.activeWaitTime === INTERACTIVE_INTERVAL && (
							<Applied
								applied={updateIntervalSeconds === INTERACTIVE_INTERVAL}
								class="ms-2"
							/>
						)}
					</p>
				</div>
				<div class="col-12 col-lg-4">
					<h3>Low-power mode</h3>

					<p class="mb-1 d-flex">
						<HistoryIcon strokeWidth={1} class="me-2 flex-shrink-0" />
						<small>
							In this mode, the device sends data to the cloud every{' '}
							{LOW_POWER_INTERVAL / 60} minutes.
						</small>
					</p>
					<p class="mb-1 d-flex">
						<SIMIcon class="me-2 flex-shrink-0" size={18} />
						<small>This mode uses around 0.05 MB of data per day.</small>
					</p>
					<p class="d-flexalign-items-center">
						<Secondary
							onClick={() => {
								setUpdateInterval(LOW_POWER_INTERVAL)
							}}
						>
							apply configuration
						</Secondary>
						{desiredConfig.activeWaitTime === LOW_POWER_INTERVAL && (
							<Applied
								applied={updateIntervalSeconds === LOW_POWER_INTERVAL}
								class="ms-2"
							/>
						)}
					</p>
				</div>
			</div>
		</div>
	)
}
