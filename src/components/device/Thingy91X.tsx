import { DeviceHeader } from '#components/DeviceHeader.js'
import { WaitingForConnection } from '#components/WaitingForConnection.js'
import { NetworkInfo } from '#components/deviceInfo/NetworkInfo.js'
import { SoftwareInfo } from '#components/deviceInfo/SoftwareInfo.js'
import { BME680 } from '#components/BME680.js'
import { type Device as TDevice } from '#context/Device.js'
import { Map } from '#map/Map.js'

export const Thingy91X = ({ device }: { device: TDevice }) => (
	<>
		<main>
			<DeviceHeader device={device} />
			<WaitingForConnection />
			<div class="container my-4">
				<div class="row mb-4">
					<section class="col-12 col-md-6">
						<NetworkInfo />
					</section>
					<section class="col-12 col-md-6">
						<SoftwareInfo device={device} />
						<BME680 />
					</section>
				</div>
			</div>
		</main>
		<div>
			<Map device={device} />
		</div>
	</>
)
