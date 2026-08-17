import { Footer } from '#components/Footer.tsx'
import { Navbar } from '#components/Navbar.tsx'
import { Provider as DeviceProvider } from '#context/Device.tsx'
import { Provider as FingerprintProvider } from '#context/Fingerprint.tsx'
import { Provider as ModelsProvider } from '#context/Models.tsx'
import { Provider as ParametersProvider } from '#context/Parameters.tsx'
import { Home } from '#page/Home.tsx'
import type { IndexPageProps } from './+data.ts'

export const Page = ({ models }: IndexPageProps) => (
	<ParametersProvider>
		<FingerprintProvider>
			<ModelsProvider models={models}>
				<DeviceProvider>
					<Navbar />
					<Home />
					<Footer />
				</DeviceProvider>
			</ModelsProvider>
		</FingerprintProvider>
	</ParametersProvider>
)
