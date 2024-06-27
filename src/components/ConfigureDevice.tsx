import { Secondary } from '#components/Buttons.js'
import { Problem } from '#components/Problem.js'
import { Success } from '#components/Success.js'
import { SIMIcon } from '#components/icons/SIMIcon.js'
import { useDevice, type Device } from '#context/Device.js'
import { formatDistance, formatFloat } from '#utils/format.js'
import type { FetchProblem } from '#utils/validatingFetch.js'
import cx from 'classnames'
import { CloudUpload, Satellite } from 'lucide-preact'
import { useState } from 'preact/hooks'

export const ConfigureDevice = ({ device }: { device: Device }) => {
	const {
		configuration: { desired: desiredConfig },
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
	const [problem, setProblem] = useState<FetchProblem | undefined>()
	const [success, setSuccess] = useState<boolean | undefined>()
	const [inProgress, setInProgress] = useState<boolean>(false)

	return (
		<>
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
										<CloudUpload size={18} strokeWidth={1} /> Update interval:{' '}
										{formatDistance(updateIntervalSeconds)}.
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
					<small>enable GNSS (should be used outdoors only)</small>
				</label>
			</p>
			<p>
				<small>
					Enabling GNSS consumes more power, compared to cellular based
					location. If the device is indoors, it will spend a long time
					searching for satellites, limiting the ability to receive and send
					cloud updates.
				</small>
			</p>
			<Secondary
				onClick={() => {
					setProblem(undefined)
					setSuccess(undefined)
					setInProgress(true)
					configure({
						gnssEnabled: selectedGNSS,
						updateIntervalSeconds: selectedUpdateIntervalSeconds,
					})
						.then((maybeUpdate) => {
							if ('problem' in maybeUpdate) {
								setProblem(maybeUpdate.problem)
							} else {
								setSuccess(true)
							}
						})
						.catch(console.error)
						.finally(() => {
							setInProgress(false)
						})
				}}
				disabled={inProgress}
			>
				{inProgress ? 'applying ...' : 'apply configuration'}
			</Secondary>
			{problem !== undefined && <Problem class="mt-2" problem={problem} />}
			{success !== undefined && (
				<Success class="mt-2">Configuration updated!</Success>
			)}
		</>
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
			<SIMIcon class="me-1 flex-shrink-0" size={18} />
			<small>
				This mode uses around {formatFloat(dataUsagePerDayMB, 2)} MB of data per
				day.
			</small>
		</span>
	)
}
