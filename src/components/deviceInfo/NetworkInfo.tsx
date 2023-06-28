import { LoadingIndicator } from '#components/ValueLoading.js'
import { useDeviceState } from '#context/DeviceState.js'
import { identifyIssuer } from 'e118-iin-list'
import { CpuIcon } from 'lucide-preact'
import { NetworkModeIcon } from '../SelectedDK.js'
import { SignalQuality } from '../SignalQuality.js'
import { LTEm } from '../icons/LTE-m.js'
import { NBIot } from '../icons/NBIot.js'
import { SIMIcon } from '../icons/SIMIcon.js'

export const NetworkInfo = () => {
	const { state } = useDeviceState()

	const { networkMode, currentBand, eest } = state?.device?.networkInfo ?? {}
	const { iccid } = state?.device?.simInfo ?? {}
	const { imei } = state?.device?.deviceInfo ?? {}
	return (
		<>
			<h2>Network information</h2>
			<h3>Network mode</h3>
			{networkMode === undefined && <LoadingIndicator height={60} />}
			{networkMode !== undefined && (
				<>
					<p class="mb-0">
						<NetworkModeIcon title={`Band ${currentBand}`} class="me-2">
							{networkMode?.includes('LTE-M') ?? false ? <LTEm /> : <NBIot />}
						</NetworkModeIcon>
					</p>
					{(networkMode?.includes('LTE-M') ?? false) && (
						<p>
							<small class="text-muted">
								Low Power, Mobility, and Low Latency for Your Applications
							</small>
						</p>
					)}
				</>
			)}

			{(networkMode?.includes('NB-IoT') ?? false) && (
				<p>
					<small class="text-muted">
						Low Power, Range, and Adaptability for Your Applications
					</small>
				</p>
			)}
			<h3>Signal Quality</h3>
			<p>
				{eest === undefined && <LoadingIndicator height={50} />}
				{eest !== undefined && <SignalQuality eest={eest} />}
			</p>
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
					This is the International Mobile Equipment Identity of your DK and
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
