import { AlertCircleIcon } from 'lucide-preact'
import { FOTAJobs } from './FOTAJobs.js'
import { SoftwareInfo } from './SoftwareInfo.js'
import { useFOTA } from '#context/FOTA.js'

export const DeviceFOTAInfo = () => {
	const { fwTypes } = useFOTA()

	return (
		<>
			<h2 id="fota">Firmware update over the air (FOTA)</h2>
			{fwTypes.length === 0 && (
				<div class="mb-4">
					<p
						class="mt-2 d-flex align-items-start"
						style={{ color: 'var(--color-nordic-fall)' }}
					>
						<AlertCircleIcon strokeWidth={2} size={30} class={'me-1'} />
						<span class="mt-1">
							The firmware running on this device does not support FOTA.
						</span>
					</p>
				</div>
			)}
			{fwTypes.length > 0 && (
				<div class="mb-4">
					<h3>Supported firmware types</h3>
					<ul>
						{fwTypes.map((type) => (
							<li>
								<code>{type}</code>
							</li>
						))}
					</ul>
				</div>
			)}
			<div class="mb-4">
				<FOTAJobs />
			</div>
			<div class="mb-4">
				<SoftwareInfo />
			</div>
		</>
	)
}
