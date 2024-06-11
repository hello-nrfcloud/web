import { BME680 } from '#components/BME680.js'
import { ConnectDevice } from '#components/ConnectDevice.js'
import { DeviceHeader } from '#components/DeviceHeader.js'
import { NetworkInfo } from '#components/deviceInfo/NetworkInfo.js'
import { SoftwareInfo } from '#components/deviceInfo/SoftwareInfo.js'
import { useDevice, type Device as TDevice } from '#context/Device.js'
import { Map } from '#map/Map.js'
import { ModelCard } from '#model/ModelCard.js'
import { Battery } from '#model/PCA20035-solar/Battery.js'
import { Chart } from '#model/PCA20035-solar/Chart.js'
import { Provider } from '#model/PCA20035-solar/HistoryContext.js'
import { ConnectionSuccess } from '#model/PCA20035-solar/ConnectionSuccess.js'
import { IncludedSIMs } from '#components/IncludedSIMInfo.js'
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
							<ModelCard model={device.model} />
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
				<div class="gridSolar">
					<Chart />
					<Map device={device} />
					<div
						class={'bg-dark'}
						style={{
							color: '#ccc',
						}}
					>
						<div class="container py-4">
							<div class="row mb-2">
								<LocationHelp device={device} />
							</div>
						</div>
					</div>
				</div>
				<div class="container my-4">
					<div class="row mb-4">
						<section class="col-12 col-md-6">
							<NetworkInfo />
						</section>
						<section class="col-12 col-md-6">
							<SoftwareInfo device={device} />
							<FOTAJobs />
							<Battery />
							<BME680 />
						</section>
					</div>
				</div>
			</main>
		</Provider>
	)
}
