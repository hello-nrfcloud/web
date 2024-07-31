import { Footer } from '#components/Footer.js'
import { Navbar } from '#components/Navbar.js'
import { Provider as ParametersProvider } from '#context/Parameters.js'
import { Feedback } from '#page/Feedback.js'

export const Page = () => (
	<ParametersProvider>
		<Navbar />
		<Feedback />
		<Footer />
	</ParametersProvider>
)
