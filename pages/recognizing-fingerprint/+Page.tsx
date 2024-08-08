import { Footer } from '#components/Footer.js'
import { Navbar } from '#components/Navbar.js'
import { Provider as DeviceProvider } from '#context/Device.js'
import { Provider as FingerprintProvider } from '#context/Fingerprint.js'
import { Provider as ModelsProvider } from '#context/Models.js'
import { Provider as ParametersProvider } from '#context/Parameters.js'
import { RecognizingFingerprint } from '#page/RecognizingFingerprint.js'
import type { IndexPageProps } from '../index/+data.js'

export const Page = ({ models }: IndexPageProps) => (
	<ParametersProvider>
		<FingerprintProvider>
			<ModelsProvider models={models}>
				<DeviceProvider>
					<Navbar />
					<RecognizingFingerprint />
					<Footer />
				</DeviceProvider>
			</ModelsProvider>
		</FingerprintProvider>
	</ParametersProvider>
)
