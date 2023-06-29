import { type Device } from '#context/Device.js'
import { useDeviceState } from '#context/DeviceState.js'
import { parseModemFirmwareVersion } from '#utils/parseModemFirmwareVersion.js'
import { AlertTriangle, CheckCircle2 } from 'lucide-preact'
import { ValueLoading } from '../ValueLoading.js'
import { isOutdated } from './isOutdated.js'

export const SoftwareInfo = ({ device }: { device: Device }) => {
	const { state } = useDeviceState()
	const type = device.type

	const appV = state?.device?.deviceInfo?.appVersion?.slice(1)
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
				{appV !== undefined && (
					<>
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
					</>
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
				{modV !== undefined && (
					<>
						{needsMfwUpdate && (
							<abbr
								class="ms-1"
								title={`Modem firmware update available, device is running ${modV}, release version is ${type.mfw.version}`}
							>
								<a
									href={type.mfw.link}
									target="_blank"
									style={{ color: 'var(--color-nordic-red)' }}
								>
									<AlertTriangle class="me-1" />
									Update available ({type.mfw.version})
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
					</>
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
