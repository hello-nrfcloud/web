import { ValueLoading } from '#components/ValueLoading.js'
import { isOutdated } from '#components/deviceInfo/isOutdated.js'
import { UpdateDevice } from '#components/fota/UpdateDevice.js'
import { useDevice, type Device } from '#context/Device.js'
import { isDeviceInformation, toDeviceInformation } from '#proto/lwm2m.js'
import { parseModemFirmwareVersion } from '#utils/parseModemFirmwareVersion.js'
import { AlertTriangle, CheckCircle2, InfoIcon } from 'lucide-preact'
import { niceLink } from '#utils/niceLink.js'

export const SoftwareInfo = ({ device }: { device: Device }) => {
	const { reported } = useDevice()
	const model = device.model

	const deviceInfo = Object.values(reported)
		.filter(isDeviceInformation)
		.map(toDeviceInformation)[0]

	const appV = deviceInfo?.appVersion
	const modV = parseModemFirmwareVersion(deviceInfo?.modemFirmware ?? '')

	const needsFwUpdate =
		appV !== undefined && isOutdated(model.firmware.version, appV)
	const needsMfwUpdate =
		modV !== undefined && isOutdated(model.mfw.version, modV)
	return (
		<>
			<h3>Application firmware version</h3>
			<p class="mb-0 d-flex align-items-center">
				<ValueLoading value={appV} />
				{appV !== undefined && (
					<>
						{needsFwUpdate && (
							<abbr
								class="ms-1"
								title={`Application firmware update available, device is running ${appV}, release version is ${model.firmware.version}`}
								style={{ color: 'var(--color-nordic-red)' }}
							>
								<AlertTriangle class="me-1" />
								Update available ({model.firmware.version})
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
			{needsFwUpdate && (
				<p>
					<small class="text-muted">
						Download the latest application firmware version for your device on{' '}
						<a href={model.firmware.link.toString()} target="_blank">
							{niceLink(model.firmware.link)}
						</a>
						.
					</small>
				</p>
			)}
			{needsFwUpdate && model.firmware.bundleId !== undefined && (
				<UpdateDevice
					bundleId={model.firmware.bundleId}
					version={model.firmware.version}
				/>
			)}
			{!needsFwUpdate && (
				<p class="mt-2 d-flex align-items-start">
					<InfoIcon strokeWidth={1} size={30} class={'me-1'} />
					<small class="mt-1">
						The application firmware for your devices is published on{' '}
						<a href={model.firmware.link.toString()} target="_blank">
							{niceLink(model.firmware.link)}
						</a>
						.
					</small>
				</p>
			)}
			<h3>Modem firmware version</h3>
			<p class="mb-0 d-flex align-items-center">
				<ValueLoading value={modV} />
				{modV !== undefined && (
					<>
						{needsMfwUpdate && (
							<abbr
								class="ms-1"
								title={`Modem firmware update available, device is running ${modV}, release version is ${model.mfw.version}`}
							>
								<a
									href={model.mfw.link.toString()}
									target="_blank"
									style={{ color: 'var(--color-nordic-red)' }}
								>
									<AlertTriangle class="me-1" />
									Update available ({model.mfw.version})
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
			{needsMfwUpdate && (
				<p>
					<small class="text-muted">
						Download the latest modem firmware version for your device on{' '}
						<a href={model.mfw.link.toString()} target="_blank">
							{niceLink(model.mfw.link)}
						</a>
						.
					</small>
				</p>
			)}
			{needsMfwUpdate && model.mfw.bundleId !== undefined && (
				<UpdateDevice
					bundleId={model.mfw.bundleId}
					version={model.mfw.version}
				/>
			)}
			{!needsMfwUpdate && (
				<p class="mt-2 d-flex align-items-start">
					<InfoIcon strokeWidth={1} size={30} class={'me-1'} />
					<small class="mt-1">
						The modem firmware for your devices is published on{' '}
						<a href={model.mfw.link.toString()} target="_blank">
							{niceLink(model.mfw.link)}
						</a>
						.
					</small>
				</p>
			)}
		</>
	)
}
