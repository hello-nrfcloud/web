import { Map } from '@components/Map'
import { CellularTag, toTag } from '@components/Tags'
import { WaitingForLocation } from '@components/WaitingForLocation'
import { Warning } from '@components/Warning'
import { useSettings } from '@context/Settings'
import { SelectDK } from '@flow/SelectDK'
import { ExternalLink } from 'lucide-preact'

export const App = () => {
	const {
		settings: { dkCredentials },
	} = useSettings()
	return (
		<>
			<main>
				<article>
					<div
						style={{
							backgroundColor: 'var(--color-nordic-blue)',
						}}
						class="pt-4 pb-4"
					>
						<header class="container pt-4 pb-4 text-white">
							<div class="mb-4">
								<Warning title="Development preview: this project is under development and not ready to use." />
							</div>
							<h1>nRF Guide</h1>
							<p>
								Welcome to <em>nRF Guide</em> your getting started guide for the
								Nordic Semiconductor Development Kits.
							</p>
						</header>
					</div>
					<div style={{ backgroundColor: '#eee' }} class="pt-4 pb-4">
						<div class="container">
							<SelectDK />
						</div>
					</div>
					{dkCredentials === undefined && <WaitingForLocation />}
					{dkCredentials !== undefined && (
						<>
							<Map />
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
											If you share your kit's location with the world, you'll
											have the chance to win one of 10 Nordic IoTees every
											month!
										</p>
										<p>
											<button type="button" class="btn btn-success">
												Share my location!
											</button>
											<a
												class="btn btn-light ms-4"
												href="https://world.nrf.guide/"
												target="_blank"
											>
												<ExternalLink class="me-2" />
												Nordic World
											</a>
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
					<section
						style={{
							backgroundColor: 'var(--color-nordic-grass)',
						}}
						class="pt-4 pb-4"
					>
						<div class="container pt-4 pb-4">
							<header class="mb-4">
								<h2>Here is what's next</h2>
								<p>
									We've selected these 100-level introduction resources if this
									is the first time using a Nordic Semiconductor Development
									Kit:
								</p>
							</header>
							<div class="mt-4 card-group">
								<div class="card">
									<h5 class="card-header d-flex justify-content-between">
										nRF Connect SDK Fundamentals
									</h5>
									<div class="card-body">
										<p class="card-text">
											Learn how to develop rich portable RTOS-based applications
											to power your next future-proof IoT product.
										</p>
										<a
											href="https://academy.nordicsemi.com/courses/nrf-connect-sdk-fundamentals/"
											class="btn btn-primary"
										>
											Take the course!
										</a>
									</div>
									<div class="card-footer d-flex justify-content-between">
										{toTag('level:100')}
									</div>
								</div>
								<div class="card">
									<h5 class="card-header d-flex justify-content-between">
										Cellular IoT Fundamentals
									</h5>
									<div class="card-body">
										<p class="card-text">
											Cellular IoT Fundamentals is a self-paced hands-on online
											course focusing on learning the essentials of cellular IoT
											application development using the highly extensible and
											feature-rich nRF Connect SDK.
										</p>
										<a
											href="https://academy.nordicsemi.com/courses/cellular-iot-fundamentals/"
											class="btn btn-primary"
										>
											Take the course!
										</a>
									</div>
									<div class="card-footer d-flex justify-content-between">
										{toTag('level:100')}
										<CellularTag />
									</div>
								</div>
								<div class="card">
									<h5 class="card-header d-flex justify-content-between">
										Location, location, location
									</h5>
									<div class="card-body">
										<p class="card-text">
											<a
												href="https://www.nordicsemi.com/Products/Cloud-services#infotabs"
												target="_blank"
											>
												nRF Cloud Location Services
											</a>{' '}
											lets you obtain location data for your devices. Location
											data is critical for many types of devices and use cases,
											for example, asset tracking, wearables, smart appliances,
											and point-of-sale payment terminals. nRF Cloud Location
											Services offers faster location fixes, improved location
											accuracy, and greater power savings.
										</p>
										<a
											href="https://docs.nrfcloud.com/LocationServices/Tutorials/Introduction/"
											class="btn btn-primary"
										>
											Follow the tutorial!
										</a>
									</div>
									<div class="card-footer d-flex justify-content-between">
										{toTag('level:100')}
										<CellularTag />
									</div>
								</div>
								<div class="card">
									<h5 class="card-header d-flex justify-content-between">
										Cellular connectivity
									</h5>
									<div class="card-body">
										<p class="card-text">
											The LTE Link Monitor is a modem client application that
											monitors the modem/link status and activity using AT
											commands.
										</p>
										<a
											href="https://infocenter.nordicsemi.com/index.jsp?topic=%2Fug_link_monitor%2FUG%2Flink_monitor%2Flm_intro.html"
											class="btn btn-primary"
										>
											Follow the tutorial!
										</a>
									</div>
									<div class="card-footer d-flex justify-content-between">
										{toTag('level:100')}
										<CellularTag />
									</div>
								</div>
							</div>
						</div>
					</section>
					<section
						style={{
							backgroundColor: 'var(--color-nordic-lake)',
						}}
						class="pt-4 pb-4"
					>
						<div class="container pt-4 pb-4">
							<header class="text-light">
								<h2>200 level intermediate resources</h2>
								<p>
									Complete these advanced topics to get the most out of Nordic
									Semiconductor's Development Kits:
								</p>
							</header>
							<div class="mt-4 card-group">
								<div class="card">
									<h5 class="card-header d-flex justify-content-between">
										Build an Asset Tracker from Scratch
									</h5>
									<div class="card-body">
										<p class="card-text">
											Complete this 200 level intermediate tutorial that
											explains how to build a full-feature asset tracking
											application from scratch.
										</p>
										<a href="#" class="btn btn-primary">
											Take the course!
										</a>
									</div>
									<div class="card-footer d-flex justify-content-between">
										{toTag('level:200')}
										<CellularTag />
									</div>
								</div>
								<div class="card">
									<h5 class="card-header d-flex justify-content-between">
										Protocols for cellular IoT
									</h5>
									<div class="card-body">
										<p class="card-text">
											What are the important factors to be considered for
											sending data to the cloud? And what protocols do you need
											for the IoT connectivity to actually work? Register and
											our experts will teach you about the key selection factors
											and protocols to be considered for your cellular IoT
											product development. Before the Q&A session at the end, we
											will show you different ways of doing a proof-of-concept
											with cloud connectivity.
										</p>
										<a
											href="https://webinars.nordicsemi.com/cloud-connectivity-and-protocols-5"
											class="btn btn-primary"
											target="_blank"
										>
											Watch the webinar
										</a>
									</div>
									<div class="card-footer d-flex justify-content-between">
										{toTag('level:200')}
										{toTag('webinar')}
										<CellularTag />
									</div>
								</div>
								<div class="card">
									<h5 class="card-header">Ultra-low power</h5>
									<div class="card-body">
										<p class="card-text">
											The Power Profiler Kit II is an easy to use tool for power
											profiling all Nordic DKs, including the nRF9160 DK, in
											addition to custom HW. It can be used throughout all
											stages of the engineering process to speed up development
											of ultra low-power short range and cellular IoT
											applications.
										</p>
										<a
											href="https://www.youtube.com/watch?v=B42lPvkUSoc"
											class="btn btn-primary"
											target="_blank"
										>
											Watch the video
										</a>
									</div>
									<div class="card-footer d-flex justify-content-between">
										{toTag('level:200')}
										{toTag('video')}
										{toTag('ultra low-power')}
									</div>
								</div>
							</div>
						</div>
					</section>
					<section
						style={{
							backgroundColor: 'var(--color-nordic-blueslate)',
						}}
						class="pt-4 pb-4"
					>
						<div class="container pt-4 pb-4">
							<header class="text-light">
								<h2>300 level advanced resources</h2>
								<p>
									Building a successful, world-class IoT product requires you to
									tackle these advanced topics:
								</p>
							</header>
							<div class="mt-4 card-group">
								<div class="card">
									<h5 class="card-header d-flex justify-content-between">
										Fleet management
									</h5>
									<div class="card-body">
										<p class="card-text">
											Take this 300 level advanced course to learn how to deploy
											and maintain a large fleet of devices.
										</p>
										<a href="#" class="btn btn-primary">
											Take the course!
										</a>
									</div>
									<div class="card-footer d-flex justify-content-between">
										{toTag('level:300')}
										<CellularTag />
									</div>
								</div>
							</div>
						</div>
					</section>
					<section
						style={{
							backgroundColor: 'var(--color-nordic-dark-grey)',
						}}
						class="pt-4 pb-4"
					>
						<div class="container pt-4 pb-4 text-light">
							<p>
								<a href="https://devzone.nordicsemi.com/" target="_blank">
									<img
										src="/static/images/devzone-white.svg"
										alt="{DevZone"
										width="250"
										height="150"
									/>
								</a>
							</p>
							<h2>Get support</h2>
							<p>
								In case you have any question, reach out to our community or
								create a private support ticket.
							</p>
						</div>
					</section>
				</article>
			</main>
		</>
	)
}
