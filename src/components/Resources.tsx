import type { Resource } from '@context/Resources'
import { toTag } from './Tags'

export const Resources = ({ resources }: { resources: Resource[] }) => {
	if (resources.length === 0)
		return (
			<div class="text-white">
				<em>No resources found.</em>
			</div>
		)
	return (
		<div class="mt-4 card-group">
			{resources.map(({ tags, callToAction: { text, link }, title, html }) => (
				<div class="card">
					<h5 class="card-header">{title}</h5>
					<div class="card-body d-flex justify-content-between flex-column">
						<div
							dangerouslySetInnerHTML={{
								__html: html,
							}}
						/>
						<div class="d-flex justify-content-end">{tags.map(toTag)}</div>
					</div>
					<div class="card-footer d-flex justify-content-end">
						<a href={link} class="btn btn-primary">
							{text}
						</a>
					</div>
				</div>
			))}
		</div>
	)
}
