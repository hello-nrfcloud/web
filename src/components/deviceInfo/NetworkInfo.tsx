import { LoadingIndicator } from '#components/ValueLoading.js'
import { useDeviceState } from '#context/DeviceState.js'
import { identifyIssuer } from 'e118-iin-list'
import { CpuIcon } from 'lucide-preact'
import { SignalQuality } from '#components/SignalQuality.js'
import { SIMIcon } from '#components/icons/SIMIcon.js'
import { NetworkModeInfo } from '#components/deviceInfo/NetworkModeInfo.js'
import {
	isConnectionInformation,
	isDeviceInformation,
	toConnectionInformation,
	toDeviceInformation,
} from '#proto/lwm2m.js'

export const NetworkInfo = () => {
	const { state } = useDeviceState()

	const networkMode = state
		.filter(isConnectionInformation)
		.map(toConnectionInformation)[0]?.networkMode

	const { iccid, imei } =
		state.filter(isDeviceInformation).map(toDeviceInformation)[0] ?? {}

	return (
		<>
			<h2>Network information</h2>
			<h3>Network mode</h3>
			<NetworkModeInfo />

			{(networkMode?.includes('NB-IoT') ?? false) && (
				<p>
					<small class="text-muted">
						Low Power, Range, and Adaptability for Your Applications
					</small>
				</p>
			)}
			<h3>Signal Quality</h3>
			<SignalQuality />
			<h3>IMEI</h3>
			<p class="mb-0 d-flex align-items-center">
				{imei === undefined && <LoadingIndicator />}
				{imei !== undefined && (
					<>
						<CpuIcon strokeWidth={1} class="me-1" /> {imei}
					</>
				)}
			</p>
			<p>
				<small class="text-muted">
					This is the International Mobile Equipment Identity of your device and
					uniquely identifies the device in a cellular network.
				</small>
			</p>
			<h3>ICCID</h3>
			<p class="mb-0">
				{iccid === undefined && <LoadingIndicator />}
				{iccid !== undefined && (
					<span class="d-flex align-items-center">
						<SIMIcon class="me-2" />
						{iccid}
						<small class="text-muted ms-2">
							({identifyIssuer(iccid)?.companyName ?? '?'})
						</small>
					</span>
				)}
			</p>
			<p>
				<small class="text-muted">
					SIM card vendors are identified using this{' '}
					<a
						href="https://github.com/NordicSemiconductor/e118-iin-list-js"
						target="_blank"
					>
						e.118 database
					</a>
					.
				</small>
			</p>
		</>
	)
}
