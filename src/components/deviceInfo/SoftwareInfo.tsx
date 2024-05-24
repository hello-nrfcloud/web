import { type Device } from '#context/Device.js'
import { useDeviceState } from '#context/DeviceState.js'
import { parseModemFirmwareVersion } from '#utils/parseModemFirmwareVersion.js'
import { AlertTriangle, CheckCircle2 } from 'lucide-preact'
import { ValueLoading } from '#components/ValueLoading.js'
import { isOutdated } from '#components/deviceInfo/isOutdated.js'
import { isDeviceInformation, toDeviceInformation } from '#proto/lwm2m.js'

export const SoftwareInfo = ({ device }: { device: Device }) => {
	const { state } = useDeviceState()
	const type = device.model

	const deviceInfo = state
		.filter(isDeviceInformation)
		.map(toDeviceInformation)[0]
	const appV = deviceInfo?.appVersion
	const modV = parseModemFirmwareVersion(deviceInfo?.modemFirmware ?? '')

	const needsFwUpdate = isOutdated(device.model.firmware.version, appV)
	const needsMfwUpdate = isOutdated(device.model.mfw.version, modV)
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
					<a href={type.firmware.link} target="_blank">
						Download the latest application firmware version
					</a>{' '}
					for your device.
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
					<a href={type.mfw.link} target="_blank">
						Download the latest modem firmware version
					</a>{' '}
					for your device.
				</small>
			</p>
		</>
	)
}
