import { SIMIcon } from '#components/icons/SIMIcon.js'
import { LoadingIndicator } from '#components/ValueLoading.js'
import { useDevice } from '#context/Device.js'
import { useSIMDetails } from '#context/SIMDetails.js'
import { identifyIssuer } from 'e118-iin-list'
import { CpuIcon } from 'lucide-preact'

export const NetworkInfo = () => {
	const { imei } = useDevice()
	const { iccid } = useSIMDetails()

	return (
		<section data-testid="network-info">
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
					<span class="d-flex align-items-start">
						<SIMIcon class="me-2" />
						<span>
							{iccid}
							<br />
							<small class="text-muted">
								{identifyIssuer(iccid)?.companyName ?? 'unknown vendor'}
							</small>
						</span>
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
		</section>
	)
}
