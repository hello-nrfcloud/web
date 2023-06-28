import type { DK } from '#context/DKs.js'
import { useDevice } from '#context/Device.js'
import { useDeviceState } from '#context/DeviceState.js'
import { useFingerprint } from '#context/Fingerprint.js'
import { parseModemFirmwareVersion } from '#utils/parseModemFirmwareVersion.js'
import { compareVersions } from 'compare-versions'
import { identifyIssuer } from 'e118-iin-list'
import { AlertTriangle, CheckCircle2, CpuIcon, Link2Icon } from 'lucide-preact'
import type { PropsWithChildren } from 'preact/compat'
import { styled } from 'styled-components'
import { SecondaryLink } from './Buttons.js'
import { SignalQuality } from './SignalQuality.js'
import { Danger } from './buttons/Button.js'
import { LTEm } from './icons/LTE-m.js'
import { NBIot } from './icons/NBIot.js'
import { SIMIcon } from './icons/SIMIcon.js'

const NetworkModeIcon = styled.abbr`
	svg {
		max-width: 100px;
		height: auto;
	}
`

export const SelectedDK = ({
	selected,
	children,
}: PropsWithChildren<{ selected: DK }>) => {
	const { device } = useDevice()
	const { clear, fingerprint } = useFingerprint()
	const { state } = useDeviceState()

	let needsMfwUpdate = false
	let needsFwUpdate = false

	const appV = state?.device?.deviceInfo?.appVersion ?? '0.0.0'
	const modV =
		parseModemFirmwareVersion(state?.device?.deviceInfo?.modemFirmware ?? '') ??
		'0.0.0'

	try {
		needsMfwUpdate = compareVersions(selected.mfw.version, modV) === 1
	} catch {
		needsFwUpdate = true
	}

	try {
		needsFwUpdate = compareVersions(selected.firmware.version, appV) === 1
	} catch {
		needsFwUpdate = true
	}

	const networkInfo = state?.device?.networkInfo

	return (
		<div class="container my-4">
			<header class="row mt-4">
				<div class="col d-flex justify-content-between align-items-center">
					<h1>
						<span>Your development kit:</span>
						<strong class="ms-1">{selected.title}</strong>
						<small class="text-muted ms-1">({selected.model})</small>
					</h1>
					<div>
						<SecondaryLink
							class="me-2"
							href={`https://${DOMAIN_NAME}/${fingerprint}`}
							title="Use this link to share your device with someone else"
						>
							<Link2Icon />
						</SecondaryLink>
						<Danger
							outline
							onClick={() => {
								clear()
							}}
						>
							clear
						</Danger>
					</div>
				</div>
			</header>
			{device !== undefined && (
				<div class="row mb-4">
					<section class="col">
						{networkInfo?.networkMode !== undefined &&
							networkInfo?.currentBand !== undefined && (
								<>
									<h2>Network mode</h2>
									<p class="mb-0">
										<NetworkModeIcon
											title={`Band ${networkInfo.currentBand}`}
											class="me-2"
										>
											{networkInfo.networkMode?.includes('LTE-M') ?? false ? (
												<LTEm />
											) : (
												<NBIot />
											)}
										</NetworkModeIcon>
									</p>
									{(networkInfo.networkMode?.includes('LTE-M') ?? false) && (
										<p>
											<small class="text-muted">
												Low Power, Mobility, and Low Latency for Your
												Applications
											</small>
										</p>
									)}
									{(networkInfo.networkMode?.includes('NB-IoT') ?? false) && (
										<p>
											<small class="text-muted">
												Low Power, Range, and Adaptability for Your Applications
											</small>
										</p>
									)}
								</>
							)}
						{networkInfo?.eest !== undefined && (
							<>
								<h2>Signal Quality</h2>
								<p>
									<SignalQuality eest={networkInfo.eest} />
								</p>
							</>
						)}
						{state?.device?.deviceInfo?.imei !== undefined && (
							<>
								<h2>IMEI</h2>
								<p class="mb-0 d-flex align-items-center">
									<CpuIcon strokeWidth={1} class="me-1" />{' '}
									{state.device.deviceInfo.imei}
								</p>
								<p>
									<small class="text-muted">
										This is the International Mobile Equipment Identity of your
										DK and uniquely identifies the device in a cellular network.
									</small>
								</p>
							</>
						)}
						{state?.device?.simInfo?.iccid !== undefined && (
							<>
								<h2>ICCID</h2>
								<p class="mb-0">
									<span class="d-flex align-items-center">
										<SIMIcon class="me-2" />
										{state.device.simInfo.iccid}
										<small class="text-muted ms-2">
											(
											{identifyIssuer(state.device.simInfo.iccid)
												?.companyName ?? '?'}
											)
										</small>
									</span>
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
						)}
						{state?.device?.deviceInfo?.appVersion !== undefined && (
							<>
								<h2>Application firmware version</h2>
								<p class="mb-0">
									{appV}
									{needsFwUpdate && (
										<abbr
											class="ms-1"
											title={`Application firmware update available, device is running ${appV}, release version is ${selected.firmware.version}`}
										>
											<a
												href={selected.firmware.link}
												target="_blank"
												style={{ color: 'var(--color-nordic-red)' }}
											>
												<AlertTriangle class="me-1" />
												Update available ({selected.firmware.version})
											</a>
										</abbr>
									)}
									{!needsFwUpdate && (
										<abbr
											style={{ color: 'var(--color-nordic-power)' }}
											class="ms-1"
											title={'Application firmware is up to date.'}
										>
											<CheckCircle2 size={20} />
										</abbr>
									)}
								</p>
							</>
						)}
						{!needsFwUpdate && (
							<p>
								<small class="text-muted">
									You can download the latest application firmware version for
									your kit{' '}
									<a href={selected.firmware.link} target="_blank">
										here
									</a>
									.
								</small>
							</p>
						)}
						{state?.device?.deviceInfo?.modemFirmware !== undefined && (
							<>
								<h2>Modem firmware version</h2>
								<p class="mb-0">
									<span>{modV}</span>
									{needsMfwUpdate && (
										<abbr
											class="ms-1"
											title={`Modem firmware update available, device is running ${modV}, release version is ${selected.firmware.version}`}
										>
											<a
												href={selected.mfw.link}
												target="_blank"
												style={{ color: 'var(--color-nordic-red)' }}
											>
												<AlertTriangle class="me-1" />
												Update available ({selected.firmware.version})
											</a>
										</abbr>
									)}
									{!needsMfwUpdate && (
										<abbr
											style={{ color: 'var(--color-nordic-power)' }}
											class="ms-1"
											title={'Modem firmware is up to date.'}
										>
											<CheckCircle2 size={20} />
										</abbr>
									)}
								</p>
								{!needsMfwUpdate && (
									<p>
										<small class="text-muted">
											You can download the latest modem firmware version for
											your kit{' '}
											<a href={selected.mfw.link} target="_blank">
												here
											</a>
											.
										</small>
									</p>
								)}
							</>
						)}
						{children}
					</section>
				</div>
			)}
		</div>
	)
}
