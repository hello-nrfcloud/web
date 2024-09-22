import { type Model } from '#content/models/types.js'
import { FileText } from 'lucide-preact'

export const ModelResources = ({ type }: { type: Model }) => (
	<section class="pt-4 pb-4 bg-sun">
		<div class="container">
			<div class="row  justify-content-center">
				<div class="col-12  text-center">
					<h2>
						Here's what's next for your <em>{type.title}</em>
					</h2>
				</div>
			</div>
			<div class="row mt-4">
				<div class="col-6 text-center">
					<p>
						<img
							src={`/static/images/quickstart.svg`}
							alt="Quick Start"
							width={80}
							style={{ margin: '10px' }}
						/>
					</p>
					<p>
						Launch the <em>Quick Start</em> in{' '}
						<a
							href="https://www.nordicsemi.com/Products/Development-tools/nrf-connect-for-desktop"
							title="nRF Connect for Desktop"
							target="_blank"
						>
							nRF Connect for Desktop
						</a>
						.
					</p>
				</div>
				<div class="col-6 text-center">
					<p>
						<FileText strokeWidth={1} style={{ zoom: 4 }} />
					</p>
					<p>
						Read the{' '}
						<a
							href={type.links.documentation.toString()}
							title={`Documentation for ${type.title}`}
							target="_blank"
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
