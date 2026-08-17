import { Footer } from '#components/Footer.tsx'
import { Navbar } from '#components/Navbar.tsx'
import { ViewSource } from '#page/ViewSource.tsx'

export const Page = () => (
	<>
		<Navbar />
		<ViewSource />
		<Footer />
	</>
)
