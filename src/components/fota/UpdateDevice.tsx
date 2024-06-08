import { Primary } from '#components/Buttons.js'
import { Problem } from '#components/Problem.js'
import { Success } from '#components/Success.js'
import { useDevice } from '#context/Device.js'
import { useFOTA } from '#context/FOTA.js'
import { isNRFCloudServiceInfo, toNRFCloudServiceInfo } from '#proto/lwm2m.js'
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
	const { reported } = useDevice()
	const { scheduleJob } = useFOTA()
	const [success, setSuccess] = useState(false)
	const [inProgress, setInProgress] = useState(false)
	const [problem, setProblem] = useState<
		Static<typeof ProblemDetail> | undefined
	>()

	const serviceInfo = Object.values(reported)
		.filter(isNRFCloudServiceInfo)
		.map(toNRFCloudServiceInfo)[0]

	const fwTypes = serviceInfo?.fwTypes ?? []
	const fotaSupported =
		fwTypes.find((type) => bundleId.startsWith(type)) !== undefined

	if (!fotaSupported) {
		return (
			<div class="alert alert-warning">
				<h4 class="alert-heading">
					Firmware Update over the Air (FOTA) not supported
				</h4>
				{fwTypes.length === 0 && (
					<p>The firmware running on this device does not support FOTA.</p>
				)}
				{fwTypes.length > 0 && (
					<p>
						The firmware running on this device does not support this type of
						FOTA. Only these are supported:{' '}
						{fwTypes.map((type) => (
							<code class="me-1">{type}</code>
						))}
						.
					</p>
				)}
				<p>
					You can use{' '}
					<a href="https://docs.nordicsemi.com/bundle/nrfutil/" target="_blank">
						nrfutil
					</a>{' '}
					to flash the firmware from the command line.
				</p>
			</div>
		)
	}

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
