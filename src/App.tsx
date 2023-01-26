import { ConnectDK } from '@components/ConnectDK'
import { DKSelector } from '@components/DKSelector'
import { Header } from '@components/Header'
import { Map } from '@components/Map'
import { Resources } from '@components/Resources'
import { SelectedDK } from '@components/SelectedDK'
import { WaitingForLocation } from '@components/WaitingForLocation'
import { Warning } from '@components/Warning'
import { Resource, resources } from '@content/resources'
import { useDevice } from '@context/Device'
import { ExternalLink, Github, Laptop2 } from 'lucide-preact'

export const App = () => {
	const { type, device } = useDevice()

	const bySelectedType = (resource: Resource): boolean => {
		if (type === undefined) return true
		console.log(resource.tags.find((tag) => type.tags.includes(tag)))
		return resource.tags.find((tag) => type.tags.includes(tag)) !== undefined
	}

	const byTag =
		(tag: string) =>
		(resource: Resource): boolean =>
			resource.tags.includes(tag)

	return (
		<>
			<Warning title="Development preview: this project is under development and not ready to use." />
			<main>
				<article>
					<Header />
					<div style={{ backgroundColor: '#eee' }} class="pt-4 pb-4">
						<div class="container">
							{type !== undefined && <SelectedDK selected={type} />}
							{type === undefined && <DKSelector />}
						</div>
					</div>
					{device !== undefined && (
						<>
							{!device.hasLocation && (
								<>
									<div class="container p-4">
										<ConnectDK device={device} />
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
													Explainer about the map features, and nRF Cloud
													Location Services.
												</em>
											</p>
											<div class="row">
												<div class="col">
													<h3>Cellular Connection Details</h3>
													<p>
														<em>
															Explain the connection information displayed on
															the map
														</em>
													</p>
												</div>
												<div class="col">
													<h3>nRF Cloud Location services</h3>
													<p>
														nRF Cloud Location Services are a set of
														commercially available features that can be used to
														assist devices and customer applications that need
														fast and power-efficient location details. They are
														designed specifically for Nordic silicon to enable
														high performing and ultra-low power consuming
														product solution.
													</p>
												</div>
												<div class="col">
													<h3>Your SIM card</h3>
													<p>
														<em>
															Provide information about featured SIM card vendor
															in case we detect the device is using one of them.
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
												<p>
													You have successfully connected your development kit!
												</p>
												<p>
													If you share your kit's location with the world,
													you'll have the chance to win one of 10 Nordic IoTees
													every month!
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
						</>
					)}
					{type !== undefined && (
						<section
							style={{
								backgroundColor: 'var(--color-nordic-sky)',
							}}
							class="pt-4 pb-4"
						>
							<div class="container">
								<div class="row  justify-content-end">
									<div class="col-8">
										<h3>Resources for your development kit:</h3>
									</div>
								</div>
								<div class="row mt-4">
									<div class="col-4">
										<img
											alt={`${type.title} (${type.model})`}
											src={`/static/images/${type.model}.webp`}
											class="img-fluid"
										/>
										{type.title} <small>({type.model})</small>
									</div>
									<div class="col-8">
										<ul>
											<li>
												You can download the firmware for the cellular module on{' '}
												<a
													href="https://www.nordicsemi.com/Products/nRF9160/Download?lang=en#infotabs"
													target="_blank"
												>
													the product page of the nRF9160
												</a>
												.
											</li>
											<li>
												<a
													href="https://infocenter.nordicsemi.com/topic/ref_at_commands/REF/at_commands/intro.html"
													target="_blank"
												>
													Basic AT Command set
												</a>
											</li>
											<li>
												<a
													href="https://developer.nordicsemi.com/nRF_Connect_SDK/doc/latest/nrf/applications/serial_lte_modem/doc/AT_commands_intro.html#slm-at-intro"
													target="_blank"
												>
													Extended AT Command set (Serial LTE Monitor)
												</a>
											</li>
											<li>
												<a
													href="https://infocenter.nordicsemi.com/topic/ps_nrf9160/nRF9160_html5_keyfeatures.html"
													target="_blank"
												>
													nRF9160 Product Specification
												</a>
											</li>
											<li>
												<a
													href="https://infocenter.nordicsemi.com/topic/nwp_044/WP/nwp_044/intro.html"
													target="_blank"
												>
													nWP044 - Best practices for cellular IoT development
												</a>
											</li>
											<li>
												<a
													href="https://infocenter.nordicsemi.com/topic/nwp_037/WP/nwp_037/nwp_037_intro.html"
													target="_blank"
												>
													nWP037 - nRF9160 Hardware Design Guidelines
												</a>
											</li>
											<li>
												<a
													href="https://infocenter.nordicsemi.com/topic/nwp_034/WP/nwp_034/nwp_034_intro.html"
													target="_blank"
												>
													nWP034 - nRF9160 Hardware Verification Guidelines
												</a>
											</li>
										</ul>
									</div>
								</div>
							</div>
						</section>
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
							<Resources
								resources={resources
									.filter(bySelectedType)
									.filter(byTag('level:100'))}
							/>
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
							<Resources
								resources={resources
									.filter(bySelectedType)
									.filter(byTag('level:200'))}
							/>
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
							<Resources
								resources={resources
									.filter(bySelectedType)
									.filter(byTag('level:300'))}
							/>
						</div>
					</section>
					<section
						style={{
							backgroundColor: 'var(--color-nordic-dark-grey)',
						}}
						class="pt-4 pb-4"
					>
						<div class="container pt-4 pb-4 text-light">
							<div class="row">
								<div class="col">
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
									<p>
										<a
											href="https://devzone.nordicsemi.com/"
											target="_blank"
											class="btn btn-secondary"
										>
											devzone.nordicsemi.com
										</a>
									</p>
									<p>
										Additionally, you can find a variety of tutorials and blog
										posts:
									</p>
									<ul>
										<li>
											<a
												href="https://devzone.nordicsemi.com/guides/cellular-iot-guides/"
												target="_blank"
												class="text-white"
											>
												Cellular IoT guides
											</a>{' '}
											(<em>important guides should be integrated above</em>)
										</li>
									</ul>
								</div>
								<div class="col">
									<p class="mt-4 mb-4">
										<Github
											strokeWidth={1}
											style={{ width: '100px', height: '100px' }}
										/>
									</p>
									<h2>Nordic Semiconductor on Github</h2>
									<ul>
										<li>
											<a
												href="https://github.com/NordicSemiconductor"
												target="_blank"
												class="text-white"
											>
												<code>NordicSemiconductor</code>
											</a>
											: Officially supported repositories
										</li>
										<li>
											<a
												href="https://github.com/NordicPlayground"
												target="_blank"
												class="text-white"
											>
												<code>NordicPlayground</code>
											</a>
											: Emerging and unsupported projects
										</li>
										<li>
											<a
												href="https://github.com/sdk-nrf"
												target="_blank"
												class="text-white"
											>
												<code>sdk-nrf</code>
											</a>
											: nRF Connect SDK
										</li>
									</ul>
								</div>
								<div class="col">
									<p class="mt-4 mb-4">
										<Laptop2
											strokeWidth={1}
											style={{ width: '100px', height: '100px' }}
										/>
									</p>
									<h2>Important Tools</h2>
									<ul>
										<li>
											<a
												href="https://nrfconnect.github.io/vscode-nrf-connect/"
												target="_blank"
												class="text-white"
											>
												nRF Connect SDK for Visual Studio Code
											</a>
										</li>
									</ul>
								</div>
							</div>
						</div>
					</section>
				</article>
			</main>
		</>
	)
}
