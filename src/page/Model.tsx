import { ScanQR } from '#components/ScanQR.js'
import { YouTubeVideo } from '#components/YouTubeVideo.js'
import { type Model as TModel } from '#context/Models.js'

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
				</section>
				<aside class="col-12 col-md-6 col-lg-4 offset-lg-2">
					<div class="card">
						<div class="card-header">
							<h2>{model.title}</h2>
							<p class="mb-1">{model.tagline}</p>
							<p class="mb-0">
								<code class="text-muted">{model.name}</code>
							</p>
						</div>
						<img
							alt={`${model.title} (${model.name})`}
							src={`/static/images/${encodeURIComponent(
								model.name,
							)}.webp?v=${VERSION}`}
							class="img-fluid p-4"
						/>
						<div class="card-body">
							<p>{model.abstract}</p>
						</div>
						<div class="card-footer">
							<h2 class="mt-2">Links</h2>
							<ul>
								<li>
									<a href={model.links.learnMore} target={'_blank'}>
										Learn more
									</a>
								</li>
								<li>
									<a href={model.links.documentation} target={'_blank'}>
										Documentation
									</a>
								</li>
							</ul>
						</div>
					</div>
				</aside>
			</div>
		</div>
		<ScanQR type={model} />
	</main>
)
