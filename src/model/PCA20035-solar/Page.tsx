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
import { Provider as HistoryContextProvider } from '#model/PCA20035-solar/HistoryContext.js'
import { QuickGlance } from '#components/quickGlance/QuickGlance.js'
import { Configuration } from '#components/Configuration.js'
import { HideDataBefore } from '#components/HideDataBefore.js'

import './Page.css'

export const Page = ({ device }: { device: TDevice }) => {
	const { hasLiveData } = useDevice()
	return (
		<HistoryContextProvider>
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
						<section class="col-12 col-md-6 col-lg-4">
							<div class="my-4">
								<NetworkInfo />
							</div>
							<div class="my-4">
								<DeviceFOTAInfo />
							</div>
							<div class="my-4">
								<Battery />
							</div>
							<div class="my-4">
								<BME680 />
							</div>
						</section>
						<section class="col-12 col-md-6 col-lg-6 offset-lg-2">
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
		</HistoryContextProvider>
	)
}
