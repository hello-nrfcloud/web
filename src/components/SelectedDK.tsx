import type { DK } from '#context/DKs.js'
import { useDevice } from '#context/Device.js'
import { useDeviceState } from '#context/DeviceState.js'
import { useFingerprint } from '#context/Fingerprint.js'
import { parseModemFirmwareVersion } from '#utils/parseModemFirmwareVersion.js'
import { compareVersions } from 'compare-versions'
import {
	AlertTriangle,
	CheckCircle2,
	CloudLightning,
	CloudOff,
} from 'lucide-preact'
import { Secondary } from './buttons/Button.js'

export const SelectedDK = ({ selected }: { selected: DK }) => {
	const { device } = useDevice()
	const { clear } = useFingerprint()
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

	return (
		<div class="d-flex justify-content-between align-items-center">
			<div class="mt-3">
				<span class="me-1">
					{device === undefined && <CloudOff />}
					{device !== undefined && <CloudLightning />}
				</span>
				Your development kit: <strong>{selected.title}</strong> (
				{selected.model})
				{device !== undefined && (
					<dl class="mt-2">
						{state?.device?.deviceInfo?.imei !== undefined && (
							<>
								<dt>IMEI</dt>
								<dd>{state.device.deviceInfo.imei}</dd>
							</>
						)}
						{state?.device?.deviceInfo?.appVersion !== undefined && (
							<>
								<dt>Application firmware version</dt>
								<dd>
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
											<br />
											<small class="text-muted">
												You can download the latest application firmware version
												for your kit{' '}
												<a href={selected.firmware.link} target="_blank">
													here
												</a>
												.
											</small>
										</abbr>
									)}
								</dd>
							</>
						)}
						{state?.device?.deviceInfo?.modemFirmware !== undefined && (
							<>
								<dt>Modem firmware version</dt>
								<dd>
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
											<br />
											<small class="text-muted">
												You can download the latest modem firmware version for
												your kit{' '}
												<a href={selected.mfw.link} target="_blank">
													here
												</a>
												.
											</small>
										</abbr>
									)}
								</dd>
							</>
						)}
					</dl>
				)}
			</div>
			<Secondary
				outline
				onClick={() => {
					clear()
				}}
			>
				clear
			</Secondary>
		</div>
	)
}
