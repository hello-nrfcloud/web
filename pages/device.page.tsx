import { Footer } from '#components/Footer.js'
import { Navbar } from '#components/Navbar.js'
import { Provider as DKsProvider } from '#context/DKs.js'
import { Provider as DeviceProvider } from '#context/Device.js'
import { Provider as FingerprintProvider } from '#context/Fingerprint.js'
import { Provider as ParametersProvider } from '#context/Parameters.js'
import { Device } from '#page/Device.js'
import type { IndexPageProps } from './index.page.server.js'

export const Page = ({ dks }: IndexPageProps) => (
	<ParametersProvider>
		<FingerprintProvider>
			<DKsProvider DKs={dks}>
				<DeviceProvider>
					<Navbar />
					<Device />
					<Footer />
				</DeviceProvider>
			</DKsProvider>
		</FingerprintProvider>
	</ParametersProvider>
)
