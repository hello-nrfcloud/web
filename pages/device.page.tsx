import { Footer } from '#components/Footer.js'
import { Navbar } from '#components/Navbar.js'
import { Provider as ModelsProvider } from '#context/Models.js'
import { Provider as DeviceProvider } from '#context/Device.js'
import { Provider as DeviceLocationProvider } from '#context/DeviceLocation.js'
import { Provider as DeviceStateProvider } from '#context/DeviceState.js'
import { Provider as FingerprintProvider } from '#context/Fingerprint.js'
import { Provider as ParametersProvider } from '#context/Parameters.js'
import { Device } from '#page/Device.js'
import type { IndexPageProps } from './index.page.server.js'

export const Page = ({ models }: IndexPageProps) => (
	<ParametersProvider>
		<FingerprintProvider>
			<ModelsProvider models={models}>
				<DeviceProvider>
					<DeviceStateProvider>
						<DeviceLocationProvider>
							<Navbar />
							<Device />
							<Footer />
						</DeviceLocationProvider>
					</DeviceStateProvider>
				</DeviceProvider>
			</ModelsProvider>
		</FingerprintProvider>
	</ParametersProvider>
)
