import { SecondaryLink } from '@components/buttons'
import { useDKs } from '@context/DKs'

export const DKSelector = () => {
	const { DKs } = useDKs()
	return (
		<>
			<div class="row">
				{Object.entries(DKs).map(
					([
						id,
						{
							title,
							html,
							links: { learnMore },
						},
					]) => (
						<div class="col-12 col-sm-6 col-lg-4">
							<div class="card">
								<div class="card-header">
									<h2>
										{title} <small>({id})</small>
									</h2>
								</div>
								<a href={`/dk/${encodeURIComponent(id)}`}>
									<img
										alt={`${title} (${id})`}
										src={`/static/images/${encodeURIComponent(id)}.webp`}
										class="img-fluid"
									/>
								</a>
								<div class="card-body">
									<div
										dangerouslySetInnerHTML={{
											__html: html,
										}}
									/>
									<p>
										<a href={learnMore} target={'_blank'}>
											Learn more
										</a>
									</p>
								</div>
								<div class="card-footer d-flex justify-content-end">
									<SecondaryLink href={`/dk/${encodeURIComponent(id)}`}>
										select
									</SecondaryLink>
								</div>
							</div>
						</div>
					),
				)}
			</div>
		</>
	)
}
