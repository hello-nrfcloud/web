import { Footer } from '@components/Footer'
import { Navbar } from '@components/Navbar'
import { DK } from '@page/DK'
import type { DKPageProps } from './dk.page.server'

export const Page = ({ dk }: DKPageProps) => (
	<>
		<Navbar />
		<DK dk={dk} />
		<Footer />
	</>
)
