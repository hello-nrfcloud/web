import { Footer } from '#components/Footer.js'
import { Navbar } from '#components/Navbar.js'
import { Model } from '#page/Model.js'
import type { ModelPageProps } from './model.page.server'

export const Page = ({ model }: ModelPageProps) => (
	<>
		<Navbar />
		<Model model={model} />
		<Footer />
	</>
)
