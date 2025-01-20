import { BME688 } from '#components/BME688.js'
import { Collapsible } from '#components/Collapsible.js'
import { Configuration } from '#components/Configuration.js'
import { DeviceHeader } from '#components/DeviceHeader.js'
import { NetworkInfo } from '#components/deviceInfo/NetworkInfo.js'
import { DeviceFOTAInfo } from '#components/fota/DeviceFOTAInfo.js'
import { HideDataBefore } from '#components/HideDataBefore.js'
import { IncludedSIMs } from '#components/IncludedSIMInfo.js'
import { QuickGlance } from '#components/quickGlance/QuickGlance.js'
import { Troubleshooting } from '#components/Troubleshooting.js'
import { useDevice, type Device as TDevice } from '#context/Device.js'
import { DeviceMap } from '#map/DeviceMap.js'
import { LocationHelp } from '#map/LocationHelp.js'
import { Card } from '#model/PCA20065/Card.js'
import { Chart } from '#model/PCA20065/Chart.js'
import { ConnectionSuccess } from '#model/PCA20065/ConnectionSuccess.js'
import { Provider as HistoryContextProvider } from '#model/PCA20065/HistoryContext.js'

import './Page.css'

export const Page = ({ device }: { device: TDevice }) => {
	const { hasLiveData } = useDevice()

	return (
		<HistoryContextProvider>
			<main>
				<div class="container my-md-4">
					{!hasLiveData && (
						<>
							<div class="row">
								<div class="col-md-8">
									<QuickGlance class="mt-2 mt-md-0" />
									<DeviceHeader />
								</div>
								<div class="col-md-4 mb-4">
									<Card model={device.model} />
								</div>
							</div>
							<Troubleshooting />
							{device.model.includedSIMs.length > 0 && (
								<div class="row">
									<div class="col-md-8">
										<h2>Included SIMs</h2>
										<IncludedSIMs includedSIMs={device.model.includedSIMs} />
									</div>
								</div>
							)}
						</>
					)}
					{hasLiveData && (
						<>
							<div class="row">
								<div class="col-md-8">
									<QuickGlance class="mt-2 mt-md-0" />
									<DeviceHeader />
									<ConnectionSuccess />
								</div>
								<div class="col-md-4 mb-4">
									<Card model={device.model} />
								</div>
							</div>
						</>
					)}
				</div>
				<div class="bg-dark grid">
					<DeviceMap />
					<LocationHelp device={device} class="p-4 location-help" />
				</div>
				<Chart />
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
								<BME688 />
							</div>
						</section>
						<section class="col-12 col-md-6 col-lg-6 offset-lg-2">
							<div class="my-4">
								<Configuration device={device} />
								<Collapsible
									title={<h3>Learn more about the firmware behaviour</h3>}
								>
									<p>
										We have provided some sensible defaults for this firmware
										that is optimized for this quick check, more specifically:
									</p>
									<ul>
										<li>
											GNSS is disabled by default because you most likely are
											using the device for the first time from your desk
											indoors. GNSS reception is usually not possible there. You
											can enable GNSS using the{' '}
											<a href="#device-configuration">device configuration</a>{' '}
											section below.
										</li>
										<li>
											After boot, the device enters a temporary real-time mode
											for 10 minutes. In this mode, the device polls for
											configuration changes every 30 seconds and sends sensor
											updates every minute.
										</li>
										<li>
											After this time has passed, the device enters the default
											low-power mode with an update interval of 1 hour.
										</li>
										<li>
											You can put the device back in temporary real-time mode by
											pressing the button.
										</li>
										<li>
											The device will also stay in the temporary real-time mode
											if it receives a message from the cloud during this time,
											e.g. if you change the LED state.
										</li>
										<li>
											You can change the default low-power mode using the{' '}
											<a href="#device-configuration">device configuration</a>{' '}
											section below.{' '}
										</li>
									</ul>
								</Collapsible>
							</div>
							<div class="my-4">
								<HideDataBefore />
							</div>
							{device.model.includedSIMs.length > 0 && hasLiveData && (
								<div class="my-4">
									<h2>Included SIMs</h2>
									<IncludedSIMs includedSIMs={device.model.includedSIMs} />
								</div>
							)}
						</section>
					</div>
				</div>
			</main>
		</HistoryContextProvider>
	)
}
