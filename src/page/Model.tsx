import { IncludedSIMs } from '#components/IncludedSIMInfo.js'
import { ScanQR } from '#components/ScanQR.js'
import { YouTubeVideo } from '#components/YouTubeVideo.js'
import type { Model as TModel } from '#content/models/types.js'
import { ModelCard } from '#model/ModelCard.js'

export const Model = ({ model }: { model: TModel }) => (
	<main>
		<div class="container my-4">
			<div class="row mt-4">
				<section class="col-12 col-md-6 mb-4">
					<header class="row">
						<div class="col">
							<h1>{model.title}</h1>
							<p class="text-secondary">{model.tagline}</p>
						</div>
					</header>
					<div
						dangerouslySetInnerHTML={{
							__html: model.html,
						}}
					/>
					{model.video?.youtube !== undefined && (
						<YouTubeVideo
							id={model.video.youtube.id}
							title={model.video.youtube.title}
						/>
					)}
					{model.includedSIMs.length > 0 && (
						<>
							<h2>Included SIMs</h2>
							<IncludedSIMs includedSIMs={model.includedSIMs} />
						</>
					)}
				</section>
				<aside class="col-12 col-md-6 col-lg-4 offset-lg-2">
					<ModelCard model={model} />
				</aside>
			</div>
		</div>
		<ScanQR model={model} />
	</main>
)
