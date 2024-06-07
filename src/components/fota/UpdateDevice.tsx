import { Primary } from '#components/Buttons.js'
import { Problem } from '#components/Problem.js'
import { Success } from '#components/Success.js'
import { useFOTA } from '#context/FOTA.js'
import { type ProblemDetail } from '@hello.nrfcloud.com/proto/hello'
import type { Static } from '@sinclair/typebox'
import { noop } from 'lodash-es'
import { useState } from 'preact/hooks'

export const UpdateDevice = ({
	bundleId,
	version,
}: {
	bundleId: string
	version: string
}) => {
	const { scheduleJob } = useFOTA()
	const [success, setSuccess] = useState(false)
	const [inProgress, setInProgress] = useState(false)
	const [problem, setProblem] = useState<
		Static<typeof ProblemDetail> | undefined
	>()
	return (
		<form onSubmit={noop} class="mb-4">
			<h4>Firmware Update over the Air (FOTA)</h4>
			<p>You can schedule a FOTA for this device.</p>
			<p>
				This is using the{' '}
				<a
					href="https://docs.nordicsemi.com/bundle/nrf-cloud/page/Devices/FirmwareUpdate/FOTAOverview.html"
					target="_blank"
				>
					nRF Cloud Firmware Update feature
				</a>{' '}
				to send the latest firmware version to this device.
			</p>
			<Primary
				onClick={() => {
					scheduleJob(bundleId)
						.start(() => {
							setInProgress(true)
							setSuccess(false)
							setProblem(undefined)
						})
						.ok(() => {
							setSuccess(true)
						})
						.problem((problem) => {
							setProblem(problem.problem)
						})
						.done(() => {
							setInProgress(false)
						})
				}}
				disabled={inProgress}
			>
				Update to {version}
			</Primary>
			{inProgress && (
				<div class="progress mt-2">
					<div
						class="progress-bar progress-bar-striped progress-bar-animated"
						role="progressbar"
						aria-label="Animated striped example"
						aria-valuenow={50}
						aria-valuemin={0}
						aria-valuemax={100}
						style="width: 50%"
					/>
				</div>
			)}
			{success && <Success class="mt-2">FOTA scheduled!</Success>}
			{problem !== undefined && <Problem class="mt-2" problem={problem} />}
		</form>
	)
}
