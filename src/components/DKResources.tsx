import type { DK } from '#context/DKs.js'
import { FileText, Laptop2 } from 'lucide-preact'

export const DKResources = ({ type }: { type: DK }) => (
	<section
		style={{
			backgroundColor: 'var(--color-nordic-sun)',
		}}
		class="pt-4 pb-4"
	>
		<div class="container">
			<div class="row  justify-content-center">
				<div class="col-12">
					<h3>
						Here's what's next for your <em>{type.title}</em>:
					</h3>
				</div>
			</div>
			<div class="row mt-4">
				<div class="col-4">
					<img
						alt={`${type.title} (${type.model})`}
						src={`/static/images/${encodeURIComponent(type.model)}.webp`}
						class="img-fluid"
					/>
					{type.title} <small>({type.model})</small>
				</div>
				<div class="col-4 text-center">
					<p>
						<Laptop2 strokeWidth={1} style={{ zoom: 4 }} />
					</p>
					<p>
						Launch the{' '}
						<a
							href="https://www.nordicsemi.com/Products/Development-tools/nrf-connect-for-desktop"
							title="nRF Connect for Desktop"
						>
							Getting Started Guide
						</a>{' '}
						in nRF Connect for Desktop.
					</p>
				</div>
				<div class="col-4 text-center">
					<p>
						<FileText strokeWidth={1} style={{ zoom: 4 }} />
					</p>
					<p>
						Read the{' '}
						<a
							href={type.links.documentation}
							title={`Documentation for ${type.title}`}
						>
							<em>{type.title}</em> documentation
						</a>
						.
					</p>
				</div>
			</div>
		</div>
	</section>
)
