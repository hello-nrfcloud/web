import { useDevice, type Device } from '#context/Device.js'
import { useDeviceState } from '#context/DeviceState.js'
import { ConfigureDevice, Context } from '@hello.nrfcloud.com/proto/hello'
import type { Static } from '@sinclair/typebox'
import {
	AlertTriangle,
	HistoryIcon,
	SatelliteDish,
	UploadCloud,
	X,
} from 'lucide-preact'
import { Applied } from './Applied.js'
import { Secondary, Transparent } from './Buttons.js'
import { SIMIcon } from './icons/SIMIcon.js'
import { useState } from 'preact/hooks'

const LOW_POWER_INTERVAL = 3600
const INTERACTIVE_GNSS_INTERVAL = 120
const REAL_TIME_INTERVAL = 60

export const DeviceModeSelector = ({
	device,
	onClose,
	onInterval,
}: {
	device: Device
	onClose?: () => void
	onInterval?: (interval: number) => void
}) => {
	const { state } = useDeviceState()
	const updateIntervalSeconds = state?.config?.activeWaitTime ?? 120
	const [gnss, setGNSS] = useState<boolean>(false)

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
				<div class="col-12 col-lg-3">
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
					<p>
						<label class="form-label  d-flex align-items-center">
							<input
								type="checkbox"
								checked={gnss}
								onClick={() => setGNSS((gnss) => !gnss)}
								class="me-2"
							/>
							{gnss && (
								<>
									<small>uncheck to disable GNSS</small>
								</>
							)}
							{gnss === false && (
								<>
									<small>check to enable GNSS</small>
								</>
							)}
						</label>
					</p>
				</div>
				<div class="col-12 col-lg-3">
					<h3>Real-time mode</h3>
					<p class="mb-1 d-flex">
						<HistoryIcon strokeWidth={1} class="me-2 flex-shrink-0" />
						<small>
							In this mode, the device sends data to the cloud every{' '}
							{REAL_TIME_INTERVAL} seconds.
						</small>
					</p>
					<p class="mb-1 d-flex color-error">
						<SIMIcon class="me-2 flex-shrink-0" size={18} />
						<small>This mode uses around 3 MB of data per day.</small>
					</p>
					{gnss && (
						<p class="mb-3 d-flex">
							<AlertTriangle class="me-2 flex-shrink-0" size={18} />
							<small>
								Because of the low timeout, GNSS cannot be enabled in this mode.
							</small>
						</p>
					)}
					{!gnss && <GNSSDisabled />}
					<ApplyConfiguration
						interval={REAL_TIME_INTERVAL}
						device={device}
						onInterval={onInterval}
					/>
				</div>
				<div class="col-12 col-lg-3">
					<h3 class="d-flex align-items-center">
						<span>Interactive mode</span>
						{gnss && <SatelliteDish class={'ms-2 flex-shrink-0'} size={18} />}
					</h3>
					<p class="mb-1 d-flex">
						<HistoryIcon strokeWidth={1} class="me-2 flex-shrink-0" />
						<small>
							In this mode, the device sends data to the cloud every{' '}
							{INTERACTIVE_GNSS_INTERVAL} seconds.
						</small>
					</p>
					<p class="mb-1 d-flex color-error">
						<SIMIcon class="me-2 flex-shrink-0" size={18} />
						<small>This mode uses around 1.5 MB of data per day.</small>
					</p>
					{gnss && (
						<p class="mb-3">
							<SatelliteDish class="me-1 flex-shrink-0" size={18} />{' '}
							<small>GNSS is enabled.</small>
						</p>
					)}
					{!gnss && <GNSSDisabled />}
					<ApplyConfiguration
						interval={INTERACTIVE_GNSS_INTERVAL}
						device={device}
						onInterval={onInterval}
						gnss={gnss}
					/>
				</div>
				<div class="col-12 col-lg-3">
					<h3 class="d-flex align-items-center">
						<span>Low-power mode</span>
						{gnss && <SatelliteDish class={'ms-2 flex-shrink-0'} size={18} />}
					</h3>

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
					{gnss && (
						<p class="mb-3">
							<SatelliteDish class="me-1 flex-shrink-0" size={18} />{' '}
							<small>GNSS is enabled.</small>
						</p>
					)}
					{!gnss && <GNSSDisabled />}
					<ApplyConfiguration
						interval={LOW_POWER_INTERVAL}
						device={device}
						onInterval={onInterval}
						gnss={gnss}
					/>
				</div>
			</div>
		</div>
	)
}

const ApplyConfiguration = ({
	interval,
	device,
	onInterval,
	gnss,
}: {
	device: Device
	interval: number
	gnss?: boolean
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
				gnss: gnss ?? false,
			},
		}
		updateConfig({
			activeWaitTime: interval,
		})
		send?.(configureDevice)
		onInterval?.(interval)
	}
	return (
		<>
			<p class="mb-1">
				<Secondary
					onClick={() => {
						setUpdateInterval(interval)
					}}
				>
					apply configuration
				</Secondary>
			</p>
			<p>
				{desiredConfig.activeWaitTime === interval && (
					<Applied applied={updateIntervalSeconds === interval} />
				)}
			</p>
		</>
	)
}

const GNSSDisabled = () => (
	<p class="mb-3 d-flex text-secondary">
		<SatelliteDish class="me-1 flex-shrink-0" size={18} />{' '}
		<small>GNSS is disabled.</small>
	</p>
)
