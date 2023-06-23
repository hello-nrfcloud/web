import { Footer } from '#components/Footer.js'
import { Navbar } from '#components/Navbar.js'
import { Provider as AppSettingsProvider } from '#context/AppSettings.js'
import { ViewSource } from '#page/ViewSource.js'

export const Page = () => (
	<AppSettingsProvider>
		<Navbar />
		<ViewSource />
		<Footer />
	</AppSettingsProvider>
)
