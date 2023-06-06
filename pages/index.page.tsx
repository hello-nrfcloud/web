import { Footer } from '#components/Footer.js'
import { Navbar } from '#components/Navbar.js'
import { Provider as DKsProvider } from '#context/DKs.js'
import { Home } from '#page/Home.js'
import type { IndexPageProps } from './index.page.server'

export const Page = ({ dks }: IndexPageProps) => (
	<>
		<Navbar />
		<DKsProvider DKs={dks}>
			<Home />
		</DKsProvider>
		<Footer />
	</>
)
