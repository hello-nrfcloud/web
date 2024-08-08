import { Transparent } from '#components/Buttons.js'
import { useDevice } from '#context/Device.js'
import { useFOTA } from '#context/FOTA.js'
import { AlertCircleIcon, CircleHelp, X } from 'lucide-preact'
import { useState } from 'preact/hooks'
import { SoftwareInfo } from '../deviceInfo/SoftwareInfo.js'
import { FOTAJobs } from './FOTAJobs.js'

export const DeviceFOTAInfo = () => {
	const { fwTypes } = useFOTA()
	const { hasLiveData } = useDevice()
	const [expanded, setExpanded] = useState<boolean>(false)

	return (
		<>
			<h2 id="fota">Firmware update over the air (FOTA)</h2>
			{hasLiveData && fwTypes.length === 0 && (
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
				<div class="mb-4" id="supported-firmware-types">
					<h3 class="d-flex align-items-center justify-content-between">
						<span>Supported firmware types</span>
						<Transparent onClick={() => setExpanded((e) => !e)}>
							{!expanded && <CircleHelp strokeWidth={1} />}
							{expanded && <X strokeWidth={1} />}
						</Transparent>
					</h3>
					{!expanded &&
						fwTypes.map((type, i) => (
							<>
								<code>{type}</code>
								{i === fwTypes.length - 1 ? '' : ', '}
								{i === fwTypes.length - 2 ? ' and ' : ''}
							</>
						))}
					{expanded && (
						<dl>
							{fwTypes.map((type) => (
								<DescribeFWType type={type} />
							))}
						</dl>
					)}
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

const DescribeFWType = ({ type }: { type: string }) => {
	const desc = firmwareTypeDescriptions.get(type)
	if (desc === undefined)
		return (
			<>
				<dt>
					<code>{type}</code>
				</dt>
				<dd>
					<small>Unknown firmware type</small>
				</dd>
			</>
		)
	return (
		<>
			<dt>
				<code>{type}</code>
			</dt>
			<dd>
				<small>{desc}</small>
			</dd>
		</>
	)
}

const firmwareTypeDescriptions = new Map([
	[`APP`, `Updates the application firmware.`],
	[
		`MODEM`,
		`Updates modem firmware with a delta image. Modem firmware (both MODEM and MDM_FULL) images and bundles are controlled by Nordic Semiconductor, and cannot be uploaded to nRF Cloud.`,
	],
	[
		`MDM_FULL`,
		`Overwrites the existing modem firmware and replaces it entirely.`,
	],
	[`BOOT`, `Updates the MCUboot secondary bootloader on the nRF9160 SiP.`],
])
