import { Footer } from '@components/Footer'
import { Navbar } from '@components/Navbar'
import { Provider as DKsProvider } from '@context/DKs'
import { Home } from '@page/Home'
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
