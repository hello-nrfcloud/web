import { Footer } from '#components/Footer.js'
import { Navbar } from '#components/Navbar.js'
import { Provider as AppSettingsProvider } from '#context/AppSettings.js'
import { DK } from '#page/DK.js'
import type { DKPageProps } from './dk.page.server'

export const Page = ({ dk }: DKPageProps) => (
	<AppSettingsProvider>
		<Navbar />
		<DK dk={dk} />
		<Footer />
	</AppSettingsProvider>
)
