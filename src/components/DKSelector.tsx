import { useDevice } from '@context/Device'
import { ScanQR } from './ScanQR.js'

export const DKSelector = () => {
	const { DKs } = useDevice()
	return (
		<>
			<ScanQR />
			<h2 class="mt-4">... or select your hardware</h2>
			<div class="d-flex flex-col justify-content-between">
				{Object.entries(DKs).map(
					([
						id,
						{
							title,
							html,
							links: { learnMore },
						},
					]) => (
						<section
							class={'p-1'}
							style={{
								width: `${Math.floor(100 / Object.keys(DKs).length)}%`,
							}}
						>
							<a href={`/dk/${encodeURIComponent(id)}`}>
								<img
									alt={`${title} (${id})`}
									src={`/static/images/${encodeURIComponent(id)}.webp`}
									class="img-fluid"
								/>
								{title} <small>({id})</small>
							</a>
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
						</section>
					),
				)}
			</div>
		</>
	)
}
