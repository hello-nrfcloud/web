import { SecondaryLink } from '#components/Buttons.js'
import { useModels } from '#context/Models.js'

export const ModelSelector = () => {
	const { models } = useModels()
	return (
		<>
			<div class="row">
				{Object.entries(models).map(([id, { title, abstract, tagline }]) => (
					<div class="col-12 col-sm-6 col-lg-4">
						<div class="card">
							<div class="card-header">
								<h2>{title}</h2>
								<p class="mb-1">{tagline}</p>
								<p class="mb-0">
									<code class="text-muted">{id}</code>
								</p>
							</div>
							<a href={`/model/${encodeURIComponent(id)}`}>
								<img
									alt={`${title} (${id})`}
									src={`/static/images/${encodeURIComponent(
										id,
									)}.webp?v=${VERSION}`}
									class="img-fluid p-4"
								/>
							</a>
							<div class="card-body">
								<p>{abstract}</p>
							</div>
							<div class="card-footer d-flex justify-content-end">
								<SecondaryLink href={`/model/${encodeURIComponent(id)}`}>
									select
								</SecondaryLink>
							</div>
						</div>
					</div>
				))}
			</div>
		</>
	)
}
