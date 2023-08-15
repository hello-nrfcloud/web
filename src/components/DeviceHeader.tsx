import { type Device } from '#context/Device.js'
import { useDeviceState } from '#context/DeviceState.js'
import { useSolarThingyHistory } from '#context/models/PCA20035-solar.js'
import {
	ActivitySquareIcon,
	ChevronDownSquareIcon,
	HistoryIcon,
	Slash,
	ThermometerIcon,
	UploadCloud,
} from 'lucide-preact'
import { Ago } from './Ago.js'
import './DeviceHeader.css'
import { EnergyEstimateIcons, EnergyEstimateLabel } from './SignalQuality.js'
import { LoadingIndicator } from './ValueLoading.js'
import { LTEm } from './icons/LTE-m.js'
import { NBIot } from './icons/NBIot.js'
import { SIMIcon } from './icons/SIMIcon.js'
import { IAQ } from './model/PCA20035-solar/BME680.js'
import { BatteryIndicator } from './model/PCA20035-solar/SolarThingyBattery.js'

export const DeviceHeader = ({ device }: { device: Device }) => {
	const type = device.model
	return (
		<div class="container my-md-4">
			<header class="mt-md-4">
				<div class="row mt-3">
					<div class="col d-flex justify-content-between align-items-center">
						<h1>
							<small class="text-muted" style={{ fontSize: '16px' }}>
								Your model:{' '}
								<a href={`/model/${encodeURIComponent(type.name)}`}>
									{type.name}
								</a>
							</small>
							<br />
							<strong class="ms-1">{type.title}</strong>
						</h1>
					</div>
				</div>
				<div class="row my-4">
					<div class="col-4 col-lg-2 mb-2">
						<NetworkModeInfo />
					</div>
					<div class="col-4 col-lg-2 mb-2">
						<SignalQualityInfo />
					</div>
					<div class="col-4 col-lg-2 mb-2">
						<BatteryInfo />
					</div>
					<div class="col-6 col-lg-3 mb-2">
						<EnvironmentInfo />
					</div>
					<div class="col-6 col-lg-2 mb-2">
						<Interact />
					</div>
				</div>
				<DeviceModeSelector />
			</header>
		</div>
	)
}

const DeviceModeSelector = () => {
	const { state } = useDeviceState()
	const updateIntervalSeconds = state?.config?.activeWaitTime ?? 120

	return (
		<>
			<div class="row mt-4">
				<div class="col-4">
					<h2>
						<UploadCloud strokeWidth={1} /> Publication interval
					</h2>
					<p class={'text-secondary'}>
						Currently, the device is configured to publish data every{' '}
						{updateIntervalSeconds} seconds.
					</p>
				</div>
			</div>
			<div class="row mb-4">
				<div class="col-4">
					<p>
						The power consumption and data usage is greatly influenced by how
						often the device sends data to the cloud.
					</p>
					<p>
						Change the mode in order to preserve battery and reduce the data
						usage.
					</p>
				</div>
				<div class="col-4">
					<div class="form-check mb-1">
						<input
							class="form-check-input"
							type="radio"
							name="deviceMode"
							id="interactiveMode"
							checked={false}
							onClick={() => {}}
						/>
						<label htmlFor="interactiveMode">Interactive mode</label>
					</div>
					<p class="mb-1 d-flex">
						<HistoryIcon strokeWidth={1} class="me-2 flex-shrink-0" />
						<span>
							In this mode, the device sends data to the cloud every 120
							seconds.
						</span>
					</p>
					<p class="mb-1 d-flex">
						<SIMIcon class="me-2 flex-shrink-0" size={18} />
						<span>This mode uses around 1.5 MB of data per day.</span>
					</p>
				</div>
				<div class="col-4">
					<div class="form-check mb-1">
						<input
							class="form-check-input"
							type="radio"
							name="deviceMode"
							id="lowPowerMode"
							checked={false}
							onClick={() => {}}
						/>
						<label htmlFor="lowPowerMode">Low-power mode</label>
					</div>
					<p class="mb-1 d-flex">
						<HistoryIcon strokeWidth={1} class="me-2 flex-shrink-0" />
						<span>
							In this mode, the device sends data to the cloud every 60 minutes.
						</span>
					</p>
					<p class="mb-1 d-flex">
						<SIMIcon class="me-2 flex-shrink-0" size={18} />
						<span>This mode uses around 0.05 MB of data per day.</span>
					</p>
				</div>
			</div>
		</>
	)
}

const SignalQualityInfo = () => {
	const { state } = useDeviceState()
	const { eest } = state?.device?.networkInfo ?? {}
	const eestTs = state?.lastUpdate?.device?.networkInfo?.eest
	return (
		<span class="d-flex flex-column">
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
							<SignalIcon strokeWidth={2} />
						))(EnergyEstimateIcons[eest] ?? Slash)}
						<span>{EnergyEstimateLabel[eest]}</span>
					</span>
				</>
			)}
			{eestTs !== undefined && (
				<small class="text-muted">
					<Ago date={new Date(eestTs)} />
				</small>
			)}
		</span>
	)
}

const EnvironmentInfo = () => {
	const { airQuality, airTemperature } = useSolarThingyHistory()
	const airQualityReading = airQuality[0]
	const airTemperatureReading = airTemperature[0]
	const updateTime = airQualityReading?.ts ?? airTemperatureReading?.ts

	return (
		<span class="d-flex flex-column">
			<small class="text-muted">
				<strong>Environment</strong>
			</small>
			{airTemperatureReading?.c === undefined && (
				<LoadingIndicator width={150} />
			)}
			{airTemperatureReading?.c !== undefined && (
				<span class="me-2">
					<ThermometerIcon /> {airTemperatureReading.c} °C
				</span>
			)}
			{airQualityReading?.IAQ === undefined && (
				<LoadingIndicator width={150} class="mt-1" />
			)}
			{airQualityReading?.IAQ !== undefined && (
				<span class="me-2">
					<IAQ iaq={airQualityReading.IAQ} />
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
	const { state } = useDeviceState()
	const { networkMode, currentBand } = state?.device?.networkInfo ?? {}
	const networkModeTs = state?.lastUpdate?.device?.networkInfo?.networkMode
	return (
		<span class="d-flex flex-column">
			<small class="text-muted">
				<strong>Network mode</strong>
			</small>
			{(networkMode === undefined || currentBand === undefined) && (
				<>
					<LoadingIndicator height={25} width={70} />
					<LoadingIndicator height={16} width={100} class="mt-1" />
				</>
			)}

			{networkMode !== undefined && currentBand !== undefined && (
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
			)}
			{networkModeTs !== undefined && (
				<small class="text-muted">
					<Ago date={new Date(networkModeTs)} />
				</small>
			)}
		</span>
	)
}

const BatteryInfo = () => {
	const { battery } = useSolarThingyHistory()
	const batteryReading = battery[0]
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
			{batteryReading !== undefined && (
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

const Interact = () => {
	const { button } = useSolarThingyHistory()
	const buttonPress = button[0]
	return (
		<span class="d-flex flex-column">
			<small class="text-muted">
				<strong>Interact</strong>
			</small>
			{buttonPress === undefined && (
				<small class="d-flex">
					<ActivitySquareIcon class="me-1" />
					<span>Press the button on your device!</span>
				</small>
			)}
			{buttonPress !== undefined && (
				<>
					<small class="d-flex hot" key={`button-${buttonPress.ts}`}>
						<ChevronDownSquareIcon class="me-1" />
						<span>
							Button <strong>#{buttonPress.id}</strong> pressed
						</span>
					</small>
					<small class="text-muted">
						<Ago date={new Date(buttonPress.ts)} withSeconds />
					</small>
				</>
			)}
		</span>
	)
}
