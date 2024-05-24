import { type Device } from '#context/Device.js'
import cx from 'classnames'
import { Ban, HistoryIcon, Satellite, Settings2, X } from 'lucide-preact'
import { useEffect, useState } from 'preact/hooks'
import { Applied } from './Applied.js'
import { Secondary, Transparent } from './Buttons.js'
import { SIMIcon } from './icons/SIMIcon.js'

const LOW_POWER_INTERVAL = 3600
const INTERACTIVE_INTERVAL = 120
const REAL_TIME_INTERVAL = 60

const MIN_INTERVAL_FOR_GNSS = 120

const intervalPresets = [
	{ interval: REAL_TIME_INTERVAL, title: 'Real-time mode' },
	{ interval: INTERACTIVE_INTERVAL, title: 'Interactive mode' },
	{ interval: LOW_POWER_INTERVAL, title: 'Low-power mode' },
]

// FIXME: implement
export const DeviceModeSelector = ({
	device,
	onClose,
}: {
	device: Device
	onClose?: () => void
}) => {
	const desiredGNSS: boolean = true as boolean
	const reportedGNSS: boolean = true as boolean
	const reportedUpdateInterval = 120
	const desiredUpdateInterval = 120
	const [, setGNSS] = useState<boolean>(true)
	const [updateIntervalInput, setUpdateInterval] = useState<number>(120)

	// Disable GNSS when update interval is < MIN_INTERVAL_FOR_GNSS seconds
	useEffect(() => {
		if (updateIntervalInput === undefined) return
		if (updateIntervalInput >= MIN_INTERVAL_FOR_GNSS) return
		if (desiredGNSS === false) return
		setGNSS(false)
	}, [desiredGNSS, updateIntervalInput])

	return (
		<div class="container">
			<div class="row">
				<div class="col-12">
					<h2 class="d-flex align-items-center justify-content-between">
						<span>
							<Settings2 strokeWidth={1} /> Device configuration
						</span>
						<Transparent class="text-muted" onClick={onClose}>
							<X />
						</Transparent>
					</h2>
				</div>
			</div>
			<div class="row mb-4">
				<div class="col-12 col-md-6">
					<p class={'d-flex mb-0'}>
						<HistoryIcon strokeWidth={1} size={18} class="me-2 flex-shrink-0" />
						<small>
							Currently, the device is configured to publish data every{' '}
							{reportedUpdateInterval} seconds.
							{desiredUpdateInterval !== undefined && (
								<Applied
									desired={desiredUpdateInterval}
									reported={reportedUpdateInterval}
								/>
							)}
						</small>
					</p>
					<p class="mb-0">
						<DataUsageInfo device={device} interval={reportedUpdateInterval} />
					</p>
					<p class={'d-flex align-items-center'}>
						{reportedGNSS && (
							<>
								<Satellite
									strokeWidth={1}
									size={18}
									class="me-2 flex-shrink-0"
								/>
								<small>GNSS is enabled</small>
							</>
						)}
						{!reportedGNSS && (
							<>
								<Ban strokeWidth={1} size={18} class="me-2 flex-shrink-0" />
								<small>GNSS is disabled</small>
							</>
						)}
						{desiredGNSS !== undefined && (
							<Applied
								desired={desiredGNSS}
								reported={reportedGNSS}
								class="ms-2"
							/>
						)}
					</p>
					<p>
						The power consumption and data usage is greatly influenced by how
						often the device sends data to the cloud.
					</p>
					<h3 class="d-flex align-items-center">
						<Satellite strokeWidth={1} class="me-1" /> <span>GNSS</span>
					</h3>
					<p>
						<label class="form-label d-flex align-items-center">
							<input
								type="checkbox"
								checked={desiredGNSS}
								onClick={(e) => {
									setGNSS((e.target as HTMLInputElement).checked)
								}}
								class="me-2"
								disabled={
									updateIntervalInput !== undefined &&
									updateIntervalInput < MIN_INTERVAL_FOR_GNSS
								}
							/>
							<small>enable GNSS</small>
						</label>
					</p>
					{updateIntervalInput !== undefined &&
						updateIntervalInput < MIN_INTERVAL_FOR_GNSS && (
							<div role="alert" class={'alert alert-warning p-2'}>
								<small>
									GNSS cannot be disabled if the update interval is less than{' '}
									{MIN_INTERVAL_FOR_GNSS} seconds to allow enough time to
									reliable get a GNSS fix.
								</small>
							</div>
						)}
					<Secondary
						onClick={() => {
							/*
							FIXME: implement
							*/
						}}
						disabled
					>
						apply configuration
					</Secondary>
				</div>
				<div class="col-12 col-md-6">
					<p>
						Change the mode in order to preserve battery and reduce the data
						usage.
					</p>
					<ul class="list-group mb-3">
						{intervalPresets.map(({ interval, title }) => {
							const current = updateIntervalInput === interval
							return (
								<li
									class={cx(
										'list-group-item d-flex align-items-center justify-content-between',
										{ active: current },
									)}
									aria-current={current}
								>
									<span>
										{title}
										<DataUsageInfo device={device} interval={interval} />
									</span>
									<Secondary
										onClick={() => setUpdateInterval(interval)}
										disabled={current}
									>
										select
									</Secondary>
								</li>
							)
						})}
					</ul>
				</div>
			</div>
		</div>
	)
}

const DataUsageInfo = ({
	device,
	interval,
	class: c,
}: {
	device: Device
	interval: number
	class?: string
}) => {
	const dataUsagePerDay =
		(((24 * 60 * 60) / interval) * device.model.bytesPerUpdate) / 1024 / 1024

	// Show a warning if the current mode will drain the SIM in less than a month
	const showDataWarning = device.model.freeMbOnSIM / dataUsagePerDay < 30

	return (
		<span
			class={cx(c, 'd-flex', {
				'color-error': showDataWarning,
			})}
		>
			<SIMIcon class="me-2 flex-shrink-0" size={18} />
			<small>
				This mode uses around {dataUsagePerDay.toFixed(2)} MB of data per day.
			</small>
		</span>
	)
}
