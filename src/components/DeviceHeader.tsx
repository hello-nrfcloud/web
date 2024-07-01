import { Ago } from '#components/Ago.js'
import { IAQ } from '#components/BME680.js'
import { BatteryIndicator } from '#components/BatteryIndicator.js'
import {
	EnergyEstimateIcons,
	EnergyEstimateLabel,
} from '#components/SignalQuality.js'
import { LoadingIndicator } from '#components/ValueLoading.js'
import { LTEm } from '#components/icons/LTE-m.js'
import { NBIot } from '#components/icons/NBIot.js'
import { SIMIcon } from '#components/icons/SIMIcon.js'
import { useDevice, type Device } from '#context/Device.js'
import {
	isBatteryAndPower,
	isConnectionInformation,
	isDeviceInformation,
	isEnvironment,
	toBatteryAndPower,
	toConnectionInformation,
	toDeviceInformation,
	toEnvironment,
} from '#proto/lwm2m.js'
import { formatFloat } from '#utils/format.js'
import { identifyIssuer } from 'e118-iin-list'
import { Slash, ThermometerIcon } from 'lucide-preact'
import { CountryFlag } from './CountryFlag.js'
import './DeviceHeader.css'

export const DeviceHeader = ({ device }: { device: Device }) => (
	<header>
		<h1>
			<small
				class="text-muted"
				style={{ fontSize: '16px' }}
				data-testid="device-id"
			>
				Your device: <DeviceID device={device} />
			</small>
		</h1>
		<div class="mt-md-4">
			<div class="d-flex flex-wrap">
				<div class="me-4 mb-2 mb-lg-4">
					<NetworkModeInfo />
				</div>
				<div class="me-4 mb-2 mb-lg-4">
					<SignalQualityInfo />
				</div>
				<div class="me-4 mb-2 mb-lg-4">
					<SIMInfo />
				</div>
				<div class="me-4 mb-2 mb-lg-4">
					<BatteryInfo />
				</div>
				<div class="me-4 mb-2 mb-lg-4">
					<EnvironmentInfo />
				</div>
			</div>
		</div>
	</header>
)

const DeviceID = ({ device }: { device: Device }) => {
	const { reported } = useDevice()

	return (
		<span>
			{Object.values(reported)
				.filter(isDeviceInformation)
				.map(toDeviceInformation)[0]?.imei ?? device.id}
		</span>
	)
}

const SignalQualityInfo = () => {
	const { reported } = useDevice()
	const { eest, ts } =
		Object.values(reported)
			.filter(isConnectionInformation)
			.map(toConnectionInformation)[0] ?? {}

	return (
		<span class="d-flex flex-column" style={{ minWidth: '100px' }}>
			<small class="text-muted">
				<strong>Signal Quality</strong>
			</small>
			{eest === undefined && (
				<>
					<LoadingIndicator height={24} width={75} />
					<LoadingIndicator height={16} width={100} class="mt-1" />
				</>
			)}
			{eest !== undefined && (
				<>
					<span class="d-flex align-items-center">
						{((SignalIcon) => (
							<SignalIcon strokeWidth={2} class="me-2" />
						))(EnergyEstimateIcons.get(eest) ?? Slash)}
						<span>{EnergyEstimateLabel.get(eest)}</span>
					</span>
					{ts !== undefined && (
						<small class="text-muted">
							<Ago date={new Date(ts)} />
						</small>
					)}
				</>
			)}
		</span>
	)
}

const EnvironmentInfo = () => {
	const { reported } = useDevice()
	const environment = Object.values(reported)
		.filter(isEnvironment)
		.map(toEnvironment)[0]
	const { IAQ: iaq, c, ts: updateTime } = environment ?? {}

	return (
		<span class="d-flex flex-column">
			<small class="text-muted">
				<strong>Environment</strong>
			</small>
			{c === undefined && <LoadingIndicator width={150} />}
			{c !== undefined && (
				<span class="me-2">
					<ThermometerIcon /> {formatFloat(c)} °C
				</span>
			)}
			{iaq === undefined && <LoadingIndicator width={150} class="mt-1" />}
			{iaq !== undefined && (
				<span class="me-2">
					<IAQ iaq={iaq} />
				</span>
			)}
			{updateTime === undefined && (
				<LoadingIndicator height={16} width={100} class="mt-1" />
			)}
			{updateTime !== undefined && (
				<small class="text-muted">
					<Ago date={new Date(updateTime)} />
				</small>
			)}
		</span>
	)
}

const NetworkModeInfo = () => {
	const { reported } = useDevice()
	const { networkMode, currentBand, mccmnc, ts } =
		Object.values(reported)
			.filter(isConnectionInformation)
			.map(toConnectionInformation)[0] ?? {}

	return (
		<span class="d-flex flex-column">
			<small class="text-muted">
				<strong>Network</strong>
			</small>
			{(networkMode === undefined || currentBand === undefined) && (
				<>
					<LoadingIndicator height={25} width={70} />
					<LoadingIndicator height={16} width={100} class="mt-1" />
				</>
			)}

			{networkMode !== undefined && currentBand !== undefined && (
				<span>
					<abbr title={`Band ${currentBand}`} class="me-2">
						{networkMode?.includes('LTE-M') ?? false ? (
							<LTEm
								style={{
									height: '25px',
									width: 'auto',
								}}
							/>
						) : (
							<NBIot
								style={{
									height: '25px',
									width: 'auto',
								}}
							/>
						)}
					</abbr>
					{mccmnc !== undefined && <CountryFlag mccmnc={mccmnc} />}
				</span>
			)}
			{ts !== undefined && (
				<small class="text-muted">
					<Ago date={new Date(ts)} />
				</small>
			)}
		</span>
	)
}

const BatteryInfo = () => {
	const { reported } = useDevice()
	const batteryReading = Object.values(reported)
		.filter(isBatteryAndPower)
		.map(toBatteryAndPower)[0]

	return (
		<span class="d-flex flex-column">
			<small class="text-muted">
				<strong>Battery</strong>
			</small>
			{batteryReading === undefined && (
				<>
					<LoadingIndicator width={150} />
					<LoadingIndicator height={16} width={100} class="mt-1" />
				</>
			)}
			{batteryReading?.['%'] !== undefined && (
				<span>
					<BatteryIndicator percentage={batteryReading['%']} />
					{batteryReading['%']} % <small class="text-muted ms-1"></small>
				</span>
			)}

			{batteryReading !== undefined && (
				<small class="text-muted">
					<Ago date={new Date(batteryReading.ts)} />
				</small>
			)}
		</span>
	)
}

const SIMInfo = () => {
	const { reported } = useDevice()
	const { iccid, ts } =
		Object.values(reported)
			.filter(isDeviceInformation)
			.map(toDeviceInformation)[0] ?? {}

	return (
		<span class="d-flex flex-column">
			<small class="text-muted">
				<strong>SIM</strong>
			</small>
			{iccid === undefined && <LoadingIndicator />}
			{iccid !== undefined && (
				<>
					<span>
						<SIMIcon class="me-2" />
						<abbr title={iccid}>
							{identifyIssuer(iccid)?.companyName ?? '?'}
						</abbr>
					</span>
				</>
			)}
			{ts === undefined && (
				<LoadingIndicator height={16} width={100} class="mt-1" />
			)}
			{ts !== undefined && (
				<small class="text-muted">
					<Ago date={new Date(ts)} />
				</small>
			)}
		</span>
	)
}
