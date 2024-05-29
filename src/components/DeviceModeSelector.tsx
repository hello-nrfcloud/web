import { Applied } from '#components/Applied.js'
import { Secondary, Transparent } from '#components/Buttons.js'
import { SIMIcon } from '#components/icons/SIMIcon.js'
import { useDevice, type Device } from '#context/Device.js'
import type { ProblemDetail } from '@hello.nrfcloud.com/proto/hello'
import type { Static } from '@sinclair/typebox'
import cx from 'classnames'
import { Ban, HistoryIcon, Satellite, Settings2, X } from 'lucide-preact'
import { useState } from 'preact/hooks'
import { Problem } from './Problem.js'
import { isEqual } from 'lodash-es'

export const DeviceModeSelector = ({
	device,
	onClose,
}: {
	device: Device
	onClose?: () => void
}) => {
	const {
		configuration: { reported: reportedConfig, desired: desiredConfig },
		configure,
	} = useDevice()
	const [selectedGNSS, setGNSS] = useState<boolean>(
		desiredConfig?.gnssEnabled ?? device.model.defaultConfiguration.gnssEnabled,
	)
	const [selectedUpdateIntervalSeconds, setUpdateIntervalSeconds] =
		useState<number>(
			desiredConfig?.updateIntervalSeconds ??
				device.model.defaultConfiguration.updateIntervalSeconds,
		)
	const reportedUpdateInterval =
		reportedConfig?.updateIntervalSeconds ??
		device.model.defaultConfiguration.updateIntervalSeconds
	const reportedGNSS =
		reportedConfig?.gnssEnabled ?? device.model.defaultConfiguration.gnssEnabled
	const desiredUpdateInterval = desiredConfig?.updateIntervalSeconds
	const desiredGNSS = desiredConfig?.gnssEnabled
	const [problem, setProblem] = useState<
		Static<typeof ProblemDetail> | undefined
	>()

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
						</small>
						{desiredUpdateInterval !== undefined && (
							<Applied
								desired={desiredUpdateInterval}
								reported={reportedUpdateInterval}
								class="ms-2"
							/>
						)}
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
								checked={selectedGNSS}
								onClick={(e) => {
									setGNSS((e.target as HTMLInputElement).checked)
								}}
								class="me-2"
							/>
							<small>enable GNSS</small>
						</label>
					</p>
					<Secondary
						onClick={() => {
							setProblem(undefined)
							configure({
								gnssEnabled: selectedGNSS,
								updateIntervalSeconds: selectedUpdateIntervalSeconds,
							})
								.then((maybeUpdate) => {
									if ('problem' in maybeUpdate) {
										setProblem(maybeUpdate.problem)
									}
								})
								.catch(console.error)
						}}
					>
						apply configuration
					</Secondary>
					{problem !== undefined && <Problem problem={problem} />}
				</div>
				<div class="col-12 col-md-6">
					<p>
						Change the mode in order to preserve battery and reduce the data
						usage.
					</p>
					<ul class="list-group mb-3">
						{device.model.configurationPresets.map(
							({
								name: title,
								dataUsagePerDayMB,
								updateIntervalSeconds,
								gnssEnabled,
							}) => {
								const defaults = device.model.defaultConfiguration

								const reported = {
									updateIntervalSeconds: reportedUpdateInterval,
									gnssEnabled: reportedGNSS,
								}
								const preset = {
									updateIntervalSeconds:
										updateIntervalSeconds ?? defaults.updateIntervalSeconds,
									gnssEnabled: gnssEnabled ?? defaults.gnssEnabled,
								}

								const current = isEqual(reported, preset)
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
											<DataUsageInfo dataUsagePerDayMB={dataUsagePerDayMB} />
										</span>
										<Secondary
											onClick={() =>
												setUpdateIntervalSeconds(updateIntervalSeconds)
											}
											disabled={current}
										>
											select
										</Secondary>
									</li>
								)
							},
						)}
					</ul>
				</div>
			</div>
		</div>
	)
}

const DataUsageInfo = ({
	dataUsagePerDayMB,
	class: c,
}: {
	dataUsagePerDayMB: number
	class?: string
}) => {
	// Show a warning if the current mode will use more than 1 MB per day
	const showDataWarning = dataUsagePerDayMB > 1

	return (
		<span
			class={cx(c, 'd-flex', {
				'color-error': showDataWarning,
			})}
		>
			<SIMIcon class="me-2 flex-shrink-0" size={18} />
			<small>
				This mode uses around {dataUsagePerDayMB.toFixed(2)} MB of data per day.
			</small>
		</span>
	)
}
