import { DKResources } from '#components/DKResources.js'
import { ScanQR } from '#components/ScanQR.js'
import { YouTubeVideo } from '#components/YouTubeVideo.js'
import { type DK as TDK } from '#context/DKs.js'

export const DK = ({ dk }: { dk: TDK }) => (
	<main>
		<div class="container my-4">
			<div class="row mt-4">
				<section class="col-12 col-md-6 mb-4">
					<header class="row">
						<div class="col">
							<h1>{dk.title}</h1>
							<p>{dk.tagline}</p>
						</div>
					</header>
					<div
						dangerouslySetInnerHTML={{
							__html: dk.html,
						}}
					/>
					{dk.video?.youtube !== undefined && (
						<YouTubeVideo
							id={dk.video.youtube.id}
							title={dk.video.youtube.title}
						/>
					)}
				</section>
				<aside class="col-12 col-md-6 col-lg-4 offset-lg-2">
					<div class="card">
						<div class="card-header">
							<h2>{dk.title}</h2>
							<p class="mb-1">{dk.tagline}</p>
							<p class="mb-0">
								<code class="text-muted">{dk.model}</code>
							</p>
						</div>
						<img
							alt={`${dk.title} (${dk.model})`}
							src={`/static/images/${encodeURIComponent(
								dk.model,
							)}.webp?v=${VERSION}`}
							class="img-fluid p-4"
						/>
						<div class="card-body">
							<p>{dk.abstract}</p>
						</div>
						<div class="card-footer">
							<h2 class="mt-2">Links</h2>
							<ul>
								<li>
									<a href={dk.links.learnMore} target={'_blank'}>
										Learn more
									</a>
								</li>
								<li>
									<a href={dk.links.documentation} target={'_blank'}>
										Documentation
									</a>
								</li>
							</ul>
						</div>
					</div>
				</aside>
			</div>
		</div>
		<DKResources type={dk} />
		<ScanQR type={dk} />
	</main>
)
