import { Primary } from '#components/Buttons.js'
import { Problem } from '#components/Problem.js'
import { Success } from '#components/Success.js'
import { useDevice } from '#context/Device.js'
import { useFOTA } from '#context/FOTA.js'
import { isNRFCloudServiceInfo, toNRFCloudServiceInfo } from '#proto/lwm2m.js'
import type { FetchProblem } from '#utils/validatingFetch.js'
import {
	bundleIdToType,
	type UpgradePath,
} from '@hello.nrfcloud.com/proto/hello'
import type { Static } from '@sinclair/typebox'
import { noop } from 'lodash-es'
import { useState } from 'preact/hooks'

export const UpdateDevice = ({
	upgradePath,
	version,
}: {
	upgradePath: Static<typeof UpgradePath>
	version: string
}) => {
	const { reported } = useDevice()
	const { scheduleJob } = useFOTA()
	const [success, setSuccess] = useState(false)
	const [inProgress, setInProgress] = useState(false)
	const [problem, setProblem] = useState<FetchProblem | undefined>()

	const serviceInfo = Object.values(reported)
		.filter(isNRFCloudServiceInfo)
		.map(toNRFCloudServiceInfo)[0]

	const fwTypes = serviceInfo?.fwTypes ?? []
	const upgradeType = bundleIdToType(Object.keys(upgradePath)[0] ?? '')
	const firstTypeInUpgradePath = Object.values(upgradePath)[0]?.split('*')[0]
	const fotaSupported =
		upgradeType !== null &&
		fwTypes.find((type) => firstTypeInUpgradePath === type) !== undefined

	if (!fotaSupported) {
		return (
			<div class="alert alert-warning">
				<h4 class="alert-heading">
					Firmware Update over the Air (FOTA) not supported
				</h4>
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
					scheduleJob(upgradePath, upgradeType)
						.start(() => {
							setInProgress(true)
							setSuccess(false)
							setProblem(undefined)
						})
						.ok(() => {
							setSuccess(true)
						})
						.problem((problem) => {
							setProblem(problem)
						})
						.done(() => {
							setInProgress(false)
						})
				}}
				disabled={inProgress}
			>
				{inProgress ? 'sending ...' : <>Update to {version}</>}
			</Primary>
			{success && <Success class="mt-2">FOTA scheduled!</Success>}
			{problem !== undefined && <Problem class="mt-2" problem={problem} />}
		</form>
	)
}
