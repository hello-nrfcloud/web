import { Primary } from '#components/Buttons.js'
import { Problem } from '#components/Problem.js'
import { Success } from '#components/Success.js'
import type { Device } from '#context/Device.js'
import { useParameters } from '#context/Parameters.js'
import { Context, type ProblemDetail } from '@hello.nrfcloud.com/proto/hello'
import type { Static } from '@sinclair/typebox'
import { noop } from 'lodash-es'
import { useState } from 'preact/hooks'

export const UpdateDevice = ({
	device,
	fingerprint,
	bundleId,
	version,
}: {
	device: Device
	fingerprint: string
	bundleId: string
	version: string
}) => {
	const [success, setSuccess] = useState(false)
	const [inProgress, setInProgress] = useState(false)
	const [problem, setProblem] = useState<
		Static<typeof ProblemDetail> | undefined
	>()
	const { onParameters } = useParameters()
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
					setInProgress(true)
					setSuccess(false)
					setProblem(undefined)
					onParameters(async ({ helloApiURL }) => {
						if (device === undefined) return
						if (fingerprint === null) return
						try {
							await fetch(
								new URL(
									`./device/${device.id}/firmware?${new URLSearchParams({ fingerprint }).toString()}`,
									helloApiURL,
								),
								{
									method: 'PATCH',
									mode: 'cors',
									body: JSON.stringify({
										bundleId,
									}),
								},
							)
							setInProgress(false)
							setSuccess(true)
						} catch (err) {
							console.error(err)
							setInProgress(false)
							setProblem({
								'@context': Context.problemDetail.toString(),
								title: `Failed to schedule FOTA (${(err as Error).message})!`,
							})
						}
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
