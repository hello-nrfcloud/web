import { LoadingIndicator } from '#components/ValueLoading.js'
import { identifyIssuer } from 'e118-iin-list'
import { CpuIcon } from 'lucide-preact'
import { SIMIcon } from '#components/icons/SIMIcon.js'
import { isDeviceInformation, toDeviceInformation } from '#proto/lwm2m.js'
import { useDevice } from '#context/Device.js'

export const NetworkInfo = () => {
	const { reported } = useDevice()

	const { iccid, imei } =
		Object.values(reported)
			.filter(isDeviceInformation)
			.map(toDeviceInformation)[0] ?? {}

	return (
		<>
			<h2>IMEI</h2>
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
			<h2>ICCID</h2>
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
