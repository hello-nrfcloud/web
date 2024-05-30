import { Applied } from '#components/Applied.js'
import { Secondary } from '#components/Buttons.js'
import { SIMIcon } from '#components/icons/SIMIcon.js'
import { useDevice, type Device } from '#context/Device.js'
import { formatFloat, formatInt } from '#utils/format.js'
import type { ProblemDetail } from '@hello.nrfcloud.com/proto/hello'
import type { Static } from '@sinclair/typebox'
import cx from 'classnames'
import { Ban, CloudUpload, HistoryIcon, Satellite } from 'lucide-preact'
import { useState } from 'preact/hooks'
import { Problem } from './Problem.js'

export const ConfigureDevice = ({ device }: { device: Device }) => {
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
		<div class="row">
			<div class="col-12 col-md-5">
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
							<Satellite strokeWidth={1} size={18} class="me-2 flex-shrink-0" />
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
			</div>
			<div class="col-12 col-md-7">
				<p>
					Change the update interval in order to preserve battery and reduce the
					data usage.
				</p>
				<ul class="list-group">
					{device.model.configurationPresets.map(
						({ name: title, dataUsagePerDayMB, updateIntervalSeconds }) => {
							const current =
								updateIntervalSeconds === selectedUpdateIntervalSeconds
							return (
								<label class="mb-3">
									<input
										type="radio"
										name={title}
										value={title}
										checked={current}
										onClick={() =>
											setUpdateIntervalSeconds(updateIntervalSeconds)
										}
										class="me-2"
									/>
									<span>
										{title}
										<br />
										<small>
											<CloudUpload size={18} strokeWidth={1} class="me-1" />{' '}
											Updates every {formatInt(updateIntervalSeconds)} seconds.
										</small>
										<DataUsageInfo dataUsagePerDayMB={dataUsagePerDayMB} />
									</span>
								</label>
							)
						},
					)}
				</ul>
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
				This mode uses around {formatFloat(dataUsagePerDayMB, 2)} MB of data per
				day.
			</small>
		</span>
	)
}
