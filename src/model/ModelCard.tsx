import type { Model } from '#context/Models.js'

export const ModelCard = ({ model }: { model: Model }) => (
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
			src={`/static/images/${encodeURIComponent(model.name)}.webp?v=${VERSION}`}
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
)
