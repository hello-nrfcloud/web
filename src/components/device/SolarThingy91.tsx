import { DeviceHeader } from '#components/DeviceHeader.js'
import { WaitingForConnection } from '#components/WaitingForConnection.js'
import { NetworkInfo } from '#components/deviceInfo/NetworkInfo.js'
import { SoftwareInfo } from '#components/deviceInfo/SoftwareInfo.js'
import { BME680 } from '#components/model/PCA20035-solar/BME680.js'
import { SolarThingyBattery } from '#components/model/PCA20035-solar/SolarThingyBattery.js'
import { SolarThingyChart } from '#components/model/PCA20035-solar/SolarThingyChart.js'
import { type Device as TDevice } from '#context/Device.js'
import { Map } from '#map/Map.js'
import './SolarThingy91.css'

export const SolarThingy91 = ({ device }: { device: TDevice }) => (
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
)
