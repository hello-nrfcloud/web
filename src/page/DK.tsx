import { DKResources } from '@components/DKResources'
import { ScanQR } from '@components/ScanQR'
import { type DK as TDK } from '@context/DKs'

export const DK = ({ dk }: { dk: TDK }) => (
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
		</article>
	</main>
)
