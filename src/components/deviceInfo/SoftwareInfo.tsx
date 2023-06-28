import { type Device } from '#context/Device.js'
import { useDeviceState } from '#context/DeviceState.js'
import { parseModemFirmwareVersion } from '#utils/parseModemFirmwareVersion.js'
import { compareVersions } from 'compare-versions'
import { AlertTriangle, CheckCircle2 } from 'lucide-preact'
import { ValueLoading } from '../ValueLoading.js'

export const isOutdated = (expectedVersion: string, actualVersion?: string) => {
	if (actualVersion === undefined || actualVersion === null) return false
	try {
		return compareVersions(expectedVersion, actualVersion) === 1
	} catch {
		return false
	}
}

export const SoftwareInfo = ({ device }: { device: Device }) => {
	const { state } = useDeviceState()
	const type = device.type

	const appV = state?.device?.deviceInfo?.appVersion
	const modV = parseModemFirmwareVersion(
		state?.device?.deviceInfo?.modemFirmware ?? '',
	)

	const needsFwUpdate = isOutdated(device.type.firmware.version, appV)
	const needsMfwUpdate = isOutdated(device.type.mfw.version, modV)
	return (
		<>
			<h2>Software information</h2>
			<h3>Application firmware version</h3>
			<p class="mb-0 d-flex align-items-center">
				<ValueLoading value={appV} />
				{needsFwUpdate && (
					<abbr
						class="ms-1"
						title={`Application firmware update available, device is running ${appV}, release version is ${type.firmware.version}`}
					>
						<a
							href={type.firmware.link}
							target="_blank"
							style={{ color: 'var(--color-nordic-red)' }}
						>
							<AlertTriangle class="me-1" />
							Update available ({type.firmware.version})
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
			<p>
				<small class="text-muted">
					You can download the latest application firmware version for your kit{' '}
					<a href={type.firmware.link} target="_blank">
						here
					</a>
					.
				</small>
			</p>
			<h3>Modem firmware version</h3>
			<p class="mb-0 d-flex align-items-center">
				<ValueLoading value={modV} />
				{needsMfwUpdate && (
					<abbr
						class="ms-1"
						title={`Modem firmware update available, device is running ${modV}, release version is ${type.firmware.version}`}
					>
						<a
							href={type.mfw.link}
							target="_blank"
							style={{ color: 'var(--color-nordic-red)' }}
						>
							<AlertTriangle class="me-1" />
							Update available ({type.firmware.version})
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
			<p>
				<small class="text-muted">
					You can download the latest modem firmware version for your kit{' '}
					<a href={type.mfw.link} target="_blank">
						here
					</a>
					.
				</small>
			</p>
		</>
	)
}
