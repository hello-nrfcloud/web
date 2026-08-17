import { Footer } from '#components/Footer.tsx'
import { Navbar } from '#components/Navbar.tsx'
import { Model } from '#page/Model.tsx'
import type { ModelPageProps } from './+data.ts'

export const Page = ({ model }: ModelPageProps) => (
	<>
		<Navbar />
		<Model model={model} />
		<Footer />
	</>
)
