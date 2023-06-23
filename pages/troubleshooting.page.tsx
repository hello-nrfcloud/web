import { Footer } from '#components/Footer.js'
import { Navbar } from '#components/Navbar.js'
import { Provider as AppSettingsProvider } from '#context/AppSettings.js'
import { Troubleshooting } from '#page/Troubleshooting.js'

export const Page = () => (
	<AppSettingsProvider>
		<Navbar />
		<Troubleshooting />
		<Footer />
	</AppSettingsProvider>
)
