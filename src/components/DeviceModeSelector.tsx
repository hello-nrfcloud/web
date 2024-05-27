import { Applied } from '#components/Applied.js'
import { Secondary, Transparent } from '#components/Buttons.js'
import { SIMIcon } from '#components/icons/SIMIcon.js'
import { useDevice, type Device } from '#context/Device.js'
import { Mode, updateIntervalSeconds } from '#context/Models.js'
import type { ProblemDetail } from '@hello.nrfcloud.com/proto/hello'
import type { Static } from '@sinclair/typebox'
import cx from 'classnames'
import { Ban, HistoryIcon, Satellite, Settings2, X } from 'lucide-preact'
import { useState } from 'preact/hooks'
import { Problem } from './Problem.js'

const modes: Array<[Mode, string]> = [
	[Mode.realTime, 'Real-time mode'],
	[Mode.interactive, 'Interactive mode'],
	[Mode.lowPower, 'Low-power mode'],
]

export const DeviceModeSelector = ({
	device,
	onClose,
}: {
	device: Device
	onClose?: () => void
}) => {
	const {
		configuration: {
			reported: { mode: reportedMode, gnssEnabled: reportedGNSS },
			desired: { mode: desiredMode, gnssEnabled: desiredGNSS },
		},
		configure,
	} = useDevice()
	const [selectedGNSS, setGNSS] = useState<boolean>(desiredGNSS)
	const [selectedMode, setMode] = useState<Mode>(reportedMode)
	const reportedUpdateInterval = updateIntervalSeconds(reportedMode)
	const desiredUpdateInterval = updateIntervalSeconds(desiredMode)
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
								desired={desiredMode}
								reported={reportedMode}
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
								mode: selectedMode,
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
						{modes.map(([mode, title]) => {
							const current = selectedMode === mode
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
										<DataUsageInfo device={device} mode={mode} />
									</span>
									<Secondary onClick={() => setMode(mode)} disabled={current}>
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
	mode,
	class: c,
}: {
	device: Device
	mode: Mode
	class?: string
}) => {
	const dataUsagePerDay = device.model.modeUsagePerDayMB[mode]

	// Show a warning if the current mode will use more than 1 MB per day
	const showDataWarning = dataUsagePerDay > 1

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
