import { DeviceHeader } from '#components/DeviceHeader.js'
import { NetworkInfo } from '#components/deviceInfo/NetworkInfo.js'
import { SoftwareInfo } from '#components/deviceInfo/SoftwareInfo.js'
import { BME680 } from '#components/BME680.js'
import { useDevice, type Device as TDevice } from '#context/Device.js'
import { Map } from '#map/Map.js'
import { BatteryChart } from '#model/PCA20065/Chart.js'
import { Provider } from '#model/PCA20065/HistoryContext.js'
import { Configuration } from '#components/Configuration.js'
import { ConnectDevice } from '#components/ConnectDevice.js'
import { Card } from '#model/PCA20065/Card.js'
import { ConnectionSuccess } from './ConnectionSuccess.js'
import { IncludedSIMs } from '#components/IncludedSIMInfo.js'
import { DeviceBehaviourInfo } from './DeviceBehaviourInfo.js'
import { FOTAJobs } from '#components/deviceInfo/FOTAJobs.js'
import { LocationHelp } from '#map/LocationHelp.js'
import './Page.css'

export const Page = ({ device }: { device: TDevice }) => {
	const { hasLiveData } = useDevice()

	return (
		<Provider>
			<main>
				<div class="container my-md-4">
					<div class="row">
						<div class="col-md-8">
							<DeviceHeader device={device} />
							{!hasLiveData && <ConnectDevice />}
							{hasLiveData && <ConnectionSuccess />}
						</div>
						<div class="col-md-4 mb-4">
							<Card model={device.model} />
						</div>
					</div>
					{device.model.includedSIMs.length > 0 && !hasLiveData && (
						<div class="row">
							<div class="col-md-7">
								<h2>Included SIMs</h2>
								<IncludedSIMs includedSIMs={device.model.includedSIMs} />
							</div>
						</div>
					)}
				</div>
				<BatteryChart />
				<div class="bg-dark grid">
					<Map device={device} />
					<LocationHelp device={device} class="p-4 location-help" />
				</div>
				<div class="container my-4">
					<div class="row mb-4">
						<section class="col-12 col-md-4">
							<div class="my-4">
								<NetworkInfo />
							</div>
							<div class="my-4">
								<SoftwareInfo device={device} />
								<FOTAJobs />
							</div>
							<div class="my-4">
								<BME680 />
							</div>
						</section>
						<section class="col-12 col-md-6 offset-md-2">
							<div class="my-4">
								<DeviceBehaviourInfo />
							</div>
							<div class="my-4">
								<Configuration device={device} />
							</div>
						</section>
					</div>
				</div>
			</main>
		</Provider>
	)
}
