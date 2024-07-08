import { BME680 } from '#components/BME680.js'
import { ConnectDevice } from '#components/ConnectDevice.js'
import { DeviceHeader } from '#components/DeviceHeader.js'
import { IncludedSIMs } from '#components/IncludedSIMInfo.js'
import { DeviceFOTAInfo } from '#components/fota/DeviceFOTAInfo.js'
import { NetworkInfo } from '#components/deviceInfo/NetworkInfo.js'
import { useDevice, type Device as TDevice } from '#context/Device.js'
import { DevicePageMap } from '#map/DevicePageMap.js'
import { LocationHelp } from '#map/LocationHelp.js'
import { ModelCard } from '#model/ModelCard.js'
import { Battery } from '#model/PCA20035-solar/Battery.js'
import { Chart } from '#model/PCA20035-solar/Chart.js'
import { ConnectionSuccess } from '#model/PCA20035-solar/ConnectionSuccess.js'
import { Provider } from '#model/PCA20035-solar/HistoryContext.js'
import { QuickGlance } from '#components/quickGlance/QuickGlance.js'

import './Page.css'

export const Page = ({ device }: { device: TDevice }) => {
	const { hasLiveData } = useDevice()
	return (
		<Provider>
			<main>
				<div class="container my-md-4">
					<div class="row">
						<div class="col-md-8">
							<QuickGlance class="mt-2 mt-md-0" />
							<DeviceHeader />
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
					<DevicePageMap />
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
							<DeviceFOTAInfo />
							<Battery />
							<BME680 />
						</section>
					</div>
				</div>
			</main>
		</Provider>
	)
}
