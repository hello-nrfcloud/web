import { Footer } from '#components/Footer.tsx'
import { Navbar } from '#components/Navbar.tsx'
import { Provider as ParametersProvider } from '#context/Parameters.tsx'
import { Feedback } from '#page/Feedback.tsx'

export const Page = () => (
	<ParametersProvider>
		<Navbar />
		<Feedback />
		<Footer />
	</ParametersProvider>
)
