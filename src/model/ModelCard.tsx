import { type Model } from '#content/models/types.js'

export const ModelCard = ({ model }: { model: Model }) => (
	<div class="card">
		<div class="card-header">
			<h2>{model.title}</h2>
			<p class="mb-1">{model.tagline}</p>
			<p class="mb-0">
				<code class="text-muted">{model.slug}</code>
				{model.variant !== undefined && (
					<span>
						{' '}
						(<code>{model.variant}</code>)
					</span>
				)}
			</p>
		</div>
		<div class="d-flex justify-content-center">
			<img
				alt={`${model.title} (${model.slug})`}
				src={`/static/images/${encodeURIComponent(model.slug)}.webp?v=${VERSION}`}
				class="img-fluid p-4"
				style={{ maxWidth: '250px' }}
			/>
		</div>
		<div class="card-body">
			<p>{model.abstract}</p>
		</div>
		<div class="card-footer">
			<h2 class="mt-2">Links</h2>
			<ul>
				<li>
					<a href={model.links.learnMore.toString()} target={'_blank'}>
						Learn more
					</a>
				</li>
				<li>
					<a href={model.links.documentation.toString()} target={'_blank'}>
						Documentation
					</a>
				</li>
			</ul>
		</div>
	</div>
)
