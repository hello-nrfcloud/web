import { DKResources } from '#components/DKResources.js'
import { ScanQR } from '#components/ScanQR.js'
import { type DK as TDK } from '#context/DKs.js'

export const DK = ({ dk }: { dk: TDK }) => (
	<main>
		<article>
			<div class="container my-4">
				<header class="row">
					<div class="col d-flex justify-content-between align-items-center">
						<h1>
							<small class="text-muted" style={{ fontSize: '16px' }}>
								{dk.model}
							</small>
							<br />
							<strong class="ms-1">{dk.title}</strong>
						</h1>
					</div>
				</header>
				<div class="row mt-4">
					<section class="col-12 col-md-6 mb-4">
						<div
							dangerouslySetInnerHTML={{
								__html: dk.html,
							}}
						/>
					</section>
					<aside class="col-12 col-md-6 col-lg-4 offset-lg-2">
						<div class="card">
							<div class="card-header">
								<h2>{dk.title}</h2>
							</div>
							<img
								alt={`${dk.title} (${dk.model})`}
								src={`/static/images/${encodeURIComponent(dk.model)}.webp`}
								class="img-fluid"
							/>
							<div class="card-body">
								<p>{dk.abstract}</p>
								<h2>Links</h2>
								<ul>
									<li>
										<a href={dk.links.learnMore} target={'_blank'}>
											Learn more
										</a>
									</li>
									<li>
										<a href={dk.links.learnMore} target={'_blank'}>
											Documentation
										</a>
									</li>
								</ul>
							</div>
						</div>
					</aside>
				</div>
			</div>
		</article>
		<ScanQR />
		<DKResources type={dk} />
	</main>
)
