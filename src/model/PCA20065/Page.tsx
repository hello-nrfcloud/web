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
import { ModelCard } from '#model/ModelCard.js'
import { ConnectionSuccess } from './ConnectionSuccess.js'

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
							<ModelCard model={device.model} />
						</div>
					</div>
				</div>
				<BatteryChart />
				<Map device={device} />
				<div class="container my-4">
					<div class="row mb-4">
						<section class="col-12 col-md-6">
							<NetworkInfo />
						</section>
						<section class="col-12 col-md-6">
							<SoftwareInfo device={device} />
						</section>
					</div>
					<div class="row mb-4">
						<section class="col-12 col-md-6">
							<Configuration device={device} />
						</section>
						<section class="col-12 col-md-6">
							<BME680 />
						</section>
					</div>
				</div>
			</main>
		</Provider>
	)
}
