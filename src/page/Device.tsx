import { ConnectDevice } from '#components/ConnectDevice.js'
import { ModelResources } from '#components/ModelResources.js'
import { DeviceHeader } from '#components/DeviceHeader.js'
import { Feedback } from '#components/Feedback.js'
import { WaitingForDevice } from '#components/WaitingForDevice.js'
import { NetworkInfo } from '#components/deviceInfo/NetworkInfo.js'
import { SoftwareInfo } from '#components/deviceInfo/SoftwareInfo.js'
import { BME680 } from '#components/model/PCA20035-solar/BME680.js'
import { SolarThingyBattery } from '#components/model/PCA20035-solar/SolarThingyBattery.js'
import { useDevice, type Device as TDevice } from '#context/Device.js'
import {
	Provider as SolarThingyHistoryProvider,
	useSolarThingyHistory,
} from '#context/models/PCA20035-solar.js'
import { SolarThingyChart } from '#components/model/PCA20035-solar/SolarThingyChart.js'
import { Map } from '#map/Map.js'
import './Device.css'

export const Device = () => {
	const { device } = useDevice()

	if (device === undefined)
		return (
			<div class="container">
				<div class="row">
					<div class="col my-4">
						<WaitingForDevice />
					</div>
				</div>
			</div>
		)

	return (
		<SolarThingyHistoryProvider>
			<main>
				<DeviceHeader device={device} />
				<WaitingForConnection device={device} />
				<div class="grid">
					<SolarThingyChart />
					<Map device={device} />
				</div>
				<div class="container my-4">
					<div class="row mb-4">
						<section class="col-12 col-md-6">
							<NetworkInfo />
						</section>
						<section class="col-12 col-md-6">
							<SoftwareInfo device={device} />
							<SolarThingyBattery />
							<BME680 />
						</section>
					</div>
				</div>
			</main>
			<ModelResources type={device.model} />
			<Feedback />
		</SolarThingyHistoryProvider>
	)
}

const WaitingForConnection = ({ device }: { device: TDevice }) => {
	const { gain, battery } = useSolarThingyHistory()

	const currentGain = gain.filter(({ fromHistory }) => fromHistory !== true)
	const currentBattery = battery.filter(
		({ fromHistory }) => fromHistory !== true,
	)

	const hasLiveData = currentGain.length + currentBattery.length > 0

	if (hasLiveData) return null

	return (
		<div
			style={{ backgroundColor: 'var(--color-nordic-light-grey)' }}
			class="py-4"
		>
			<div class="container">
				<div class="row">
					<div class="col-12">
						<ConnectDevice device={device} />
					</div>
				</div>
			</div>
		</div>
	)
}
