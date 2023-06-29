import { Footer } from '#components/Footer.js'
import { Navbar } from '#components/Navbar.js'
import { Provider as AppSettingsProvider } from '#context/AppSettings.js'
import { StyleGuidePage } from '#page/StyleGuide.js'

export const Page = () => (
	<AppSettingsProvider>
		<Navbar />
		<StyleGuidePage />
		<Footer />
	</AppSettingsProvider>
)
