import { Footer } from '#components/Footer.tsx'
import { Navbar } from '#components/Navbar.tsx'
import { Provider as DeviceProvider } from '#context/Device.tsx'
import { Provider as FingerprintProvider } from '#context/Fingerprint.tsx'
import { Provider as ModelsProvider } from '#context/Models.tsx'
import { Provider as ParametersProvider } from '#context/Parameters.tsx'
import { RecognizingFingerprint } from '#page/RecognizingFingerprint.tsx'
import type { IndexPageProps } from '../index/+data.ts'

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
