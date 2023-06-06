import { DKResources } from '@components/DKResources'
import { Footer } from '@components/Footer'
import { Navbar } from '@components/Navbar'
import { ScanQR } from '@components/ScanQR'
import type { DKPageProps } from './dk.page.server'

export const Page = ({ dk }: DKPageProps) => (
	<>
		<Navbar />
		<main>
			<article>
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
								src={`/static/images/${encodeURIComponent(dk.model)}.webp`}
								class="img-fluid"
							/>
						</div>
					</div>
					<ScanQR />
				</div>
				<DKResources type={dk} />
				<Footer />
			</article>
		</main>
	</>
)
