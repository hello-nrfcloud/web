import { LightLink, Success } from '#components/Buttons.js'
import { ConnectDK } from '#components/ConnectDK.js'
import { Map } from '#components/Map.js'
import { WaitingForLocation } from '#components/WaitingForLocation.js'
import { type Device } from '#context/Device.js'
import { ExternalLink } from 'lucide-preact'

export const GenericCellularFlow = ({ device }: { device: Device }) => (
	<>
		{!device.hasLocation && (
			<>
				<div class="container p-4">
					<ConnectDK />
				</div>
				<WaitingForLocation />
			</>
		)}
		{device.hasLocation && (
			<>
				<Map />
				<div
					style={{
						backgroundColor: 'var(--color-nordic-dark-grey)',
					}}
					class="pt-4 pb-4"
				>
					<div class="container text-white">
						<h2>What you see on this map.</h2>
						<p>
							<em>
								Explainer about the map features, and nRF Cloud Location
								Services.
							</em>
						</p>
						<div class="row">
							<div class="col">
								<h3>Cellular Connection Details</h3>
								<p>
									<em>
										Explain the connection information displayed on the map
									</em>
								</p>
							</div>
							<div class="col">
								<h3>nRF Cloud Location services</h3>
								<p>
									nRF Cloud Location Services are a set of commercially
									available features that can be used to assist devices and
									customer applications that need fast and power-efficient
									location details. They are designed specifically for Nordic
									silicon to enable high performing and ultra-low power
									consuming product solution.
								</p>
							</div>
							<div class="col">
								<h3>Your SIM card</h3>
								<p>
									<em>
										Provide information about featured SIM card vendor in case
										we detect the device is using one of them.
									</em>
								</p>
							</div>
						</div>
					</div>
				</div>
				<div
					style={{
						backgroundColor: '#01509b',
						backgroundImage: 'url(/static/images/cross.webp)',
					}}
					class="pt-4 pb-4"
				>
					<div class="container pt-4 pb-4 text-light d-flex flex-row">
						<section>
							<h2>Congratulations!</h2>
							<p>You have successfully connected your development kit!</p>
							<p>
								If you share your kit's location with the world, you'll have the
								chance to win one of 10 Nordic IoTees every month!
							</p>
							<p>
								<Success>Share my location!</Success>
								<LightLink
									class="ms-4"
									href="https://world.nrfcloud.com/"
									target="_blank"
								>
									<ExternalLink class="me-2" />
									Nordic World
								</LightLink>
							</p>
						</section>
						<aside class="flex-shrink-1">
							<img
								src="/static/images/iotee.webp"
								alt="IoTee!"
								class="img-fluid"
							/>
						</aside>
					</div>
				</div>
			</>
		)}
	</>
)
