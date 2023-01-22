import { DKs } from '../DKs'
import { toTag } from './Tags'

export const DKSelector = ({
	onSelect,
}: {
	onSelect: (id: string) => unknown
}) => {
	return (
		<div class="text-bg-dark p-4">
			<h2>Please select your hardware:</h2>
			<div class="d-flex flex-col justify-content-between">
				{Object.entries(DKs).map(
					([id, { title, description, tags, learnMoreLink }]) => (
						<section
							class={'p-1'}
							style={{
								width: `${Math.floor(100 / Object.keys(DKs).length)}%`,
							}}
						>
							<button
								type={'button'}
								class="btn btn-link"
								onClick={() => onSelect?.(id)}
							>
								<img
									alt={`${title} (${id})`}
									src={`/static/images/${id}.webp`}
									class="img-fluid"
								/>
								{title} <small>({id})</small>
							</button>
							<p>{description}</p>
							<p>
								<a href={learnMoreLink} target={'_blank'}>
									Learn more
								</a>
							</p>
							<aside class={'mb-2'}>
								{tags.map((tag) => (
									<span class={'me-2'}>{toTag(tag)}</span>
								))}
							</aside>
						</section>
					),
				)}
			</div>
		</div>
	)
}
