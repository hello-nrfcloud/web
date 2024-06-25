import { BME680 } from '#components/BME680.js'
import { Configuration } from '#components/Configuration.js'
import { ConnectDevice } from '#components/ConnectDevice.js'
import { DeviceHeader } from '#components/DeviceHeader.js'
import { IncludedSIMs } from '#components/IncludedSIMInfo.js'
import { NetworkInfo } from '#components/deviceInfo/NetworkInfo.js'
import { useDevice, type Device as TDevice } from '#context/Device.js'
import { DevicePageMap } from '#map/DevicePageMap.js'
import { LocationHelp } from '#map/LocationHelp.js'
import { Card } from '#model/PCA20065/Card.js'
import { Chart } from '#model/PCA20065/Chart.js'
import { ConnectionSuccess } from '#model/PCA20065/ConnectionSuccess.js'
import { DeviceBehaviourInfo } from '#model/PCA20065/DeviceBehaviourInfo.js'
import { Provider } from '#model/PCA20065/HistoryContext.js'
import { DeviceFOTAInfo } from '#components/fota/DeviceFOTAInfo.js'
import { HideDataBefore } from '#components/HideDataBefore.js'

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
				<Chart />
				<div class="bg-dark grid">
					<DevicePageMap />
					<LocationHelp device={device} class="p-4 location-help" />
				</div>
				<div class="container my-4">
					<div class="row mb-4">
						<section class="col-12 col-md-6 col-lg-4">
							<div class="my-4">
								<NetworkInfo />
							</div>
							<div class="my-4">
								<DeviceFOTAInfo />
							</div>
							<div class="my-4">
								<BME680 />
							</div>
						</section>
						<section class="col-12 col-md-6 col-lg-6 offset-lg-2">
							<div class="my-4">
								<DeviceBehaviourInfo />
							</div>
							<div class="my-4">
								<Configuration device={device} />
							</div>
							<div class="my-4">
								<HideDataBefore />
							</div>
						</section>
					</div>
				</div>
			</main>
		</Provider>
	)
}
