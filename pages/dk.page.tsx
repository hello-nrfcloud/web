import { Footer } from '@components/Footer'
import { Header } from '@components/Header'
import { LeveledResources } from '@components/LeveledResources'
import { PreviewWarning } from '@components/PreviewWarning'
import { ScanQR } from '@components/ScanQR'
import { Provider } from '@context/Resources'
import type { DKPageProps } from './dk.page.server'

export const Page = ({ dk, resources }: DKPageProps) => (
	<Provider resources={resources}>
		<PreviewWarning />
		<main>
			<article>
				<Header />
				<div class="container mt-4 mb-4">
					<div class="row">
						<header class="col">
							<h1>
								{dk.title} <small>({dk.model})</small>
							</h1>
						</header>
					</div>
					<div class="row mt-4">
						<div
							class="col-6"
							dangerouslySetInnerHTML={{
								__html: dk.html,
							}}
						/>
						<div class="col-6">
							<img
								alt={`${dk.title} (${dk.model})`}
								src={`/static/images/${dk.model}.webp`}
								class="img-fluid"
							/>
						</div>
					</div>
					<ScanQR />
				</div>
				<LeveledResources dk={dk} />
				<Footer />
			</article>
		</main>
	</Provider>
)
