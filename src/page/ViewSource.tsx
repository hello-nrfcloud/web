import { PreviewWarning } from '@components/PreviewWarning'
import { SourceHeader } from '@components/SourceHeader'

export const ViewSource = () => (
	<>
		<PreviewWarning />
		<main>
			<article>
				<SourceHeader />
				<div class="container mt-4">
					<div class="row mt-4">
						<div class="col-6">
							<p>This sections explains how this project is built.</p>
							<p>
								We consider this a reference implementation for a consumer
								cellular IoT product, where the Nordic development kits are
								treated like a consumer cellular IoT device, for example a{' '}
								<em>Robot Lawnmower</em>, which is purchased by a consumer at a
								retail store, and when turned on should work{' '}
								<em>just like that</em>.
							</p>
							<p>
								For this to work we use nRF Cloud's{' '}
								<a
									href="https://api.nrfcloud.com/v1/#tag/IP-Devices/operation/ProvisionDevices"
									target="_blank"
								>
									ProvisionDevices
								</a>{' '}
								endpoint to pre-provision the devices to a nRF Cloud tenant and
								ship a pre-activated SIM card.
							</p>
							<p>
								The web site is a static web app, and the source code is
								published on{' '}
								<a href="https://github.com/bifravst/nrf.guide" target="_blank">
									GitHub
								</a>
								.
							</p>
						</div>
					</div>
				</div>
			</article>
		</main>
	</>
)
