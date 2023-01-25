import { ConnectDK } from '@components/ConnectDK'
import { DKSelector } from '@components/DKSelector'
import { Map } from '@components/Map'
import { SelectedDK } from '@components/SelectedDK'
import { CellularTag, toTag } from '@components/Tags'
import { WaitingForLocation } from '@components/WaitingForLocation'
import { Warning } from '@components/Warning'
import { useDevice } from '@context/Device'
import { ExternalLink, Github, Laptop2 } from 'lucide-preact'

export const App = () => {
	const { type, device } = useDevice()
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
					<section
						style={{
							backgroundColor: 'var(--color-nordic-sky)',
						}}
						class="pt-4 pb-4"
					>
						<div class="container">
							<h3 class="mt-4">Resources for your development kit:</h3>
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
					</section>
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
									<h5 class="card-header">
										Set up your development environment
									</h5>
									<div class="card-body">
										<p class="card-text">
											To begin using the nRF Connect SDK, it is recommended to
											start with this guide.&nbsp;
										</p>
										<p class="card-text">
											Make sure that you have completed all the mentioned step
											to avoid problems later in the development process.
										</p>
										<a
											href="https://developer.nordicsemi.com/nRF_Connect_SDK/doc/latest/nrf/getting_started.html"
											class="btn btn-primary"
										>
											Set up your development environment
										</a>
									</div>
									<div class="card-footer d-flex justify-content-between">
										{toTag('level:100')}
										{toTag('SDK')}
									</div>
								</div>
								<div class="card">
									<h5 class="card-header">nRF Connect SDK Fundamentals</h5>
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
										{toTag('SDK')}
									</div>
								</div>
								<div class="card">
									<h5 class="card-header">Cellular IoT Fundamentals</h5>
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
									<h5 class="card-header">Location, location, location</h5>
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
									<h5 class="card-header">Cellular connectivity</h5>
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
									<h5 class="card-header">
										nRF9160 Hardware Integration Guide
									</h5>
									<div class="card-body">
										<p class="card-text">
											This document complements the nRF9160 Product
											Specification to provide recommendations and guidelines
											for designing devices based on the nRF9160 module.
										</p>
										<a
											href="https://nsscprodmedia.blob.core.windows.net/prod/software-and-other-downloads/sip/nrf9160-sip/hardware-integration-guide/nrf9160hardwareintegrationguidev12.pdf"
											class="btn btn-primary"
										>
											Read the guide
										</a>
									</div>
									<div class="card-footer d-flex justify-content-between">
										{toTag('level:200')}
										<CellularTag />
										{toTag('product:nrf9160')}
									</div>
								</div>
								<div class="card">
									<h5 class="card-header">
										Build an Asset Tracker from Scratch
									</h5>
									<div class="card-body">
										<p class="card-text">
											Complete this 200 level intermediate tutorial that
											explains how to build a full-feature asset tracking
											application from scratch.
										</p>
										<a href="https://nordicsemi.com/" class="btn btn-primary">
											Take the course!
										</a>
									</div>
									<div class="card-footer d-flex justify-content-between">
										{toTag('level:200')}
										<CellularTag />
									</div>
								</div>
								<div class="card">
									<h5 class="card-header">Protocols for cellular IoT</h5>
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
								<div class="card">
									<h5 class="card-header">
										Power-optimizing cellular applications
									</h5>
									<div class="card-body">
										<p class="card-text">
											An nRF9160 DK can draw current ranging from a few micro
											amperes (in sleep mode) to hundreds of milli amperes (when
											the radio is active). To achieve long battery life, it is
											crucial that the application is optimized in the use of
											the radio.
										</p>
										<a
											href="https://developer.nordicsemi.com/nRF_Connect_SDK/doc/latest/nrf/app_power_opt.html#cellular-applications"
											class="btn btn-primary"
											target="_blank"
										>
											Read the guide
										</a>
									</div>
									<div class="card-footer d-flex justify-content-between">
										{toTag('level:200')}
										{toTag('ultra low-power')}
										<CellularTag />
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
									<h5 class="card-header">Fleet management</h5>
									<div class="card-body">
										<p class="card-text">
											Take this 300 level advanced course to learn how to deploy
											and maintain a large fleet of devices.
										</p>
										<a href="https://nordicsemi.com/" class="btn btn-primary">
											Take the course!
										</a>
									</div>
									<div class="card-footer d-flex justify-content-between">
										{toTag('level:300')}
										<CellularTag />
									</div>
								</div>
								<div class="card">
									<h5 class="card-header">Connection tracking</h5>
									<div class="card-body">
										<p class="card-text">
											With the “Trace Collector V2 Preview” which is part of the
											“nRF Connect for Desktop” you are able to get live traces
											between you application, modem and the cellular network:
										</p>
										<a
											href="https://infocenter.nordicsemi.com/topic/ug_trace_collector/UG/trace_collector/intro.html"
											class="btn btn-primary"
										>
											Read the guide!
										</a>
									</div>
									<div class="card-footer d-flex justify-content-between">
										{toTag('level:300')}
										<CellularTag />
									</div>
								</div>
								<div class="card">
									<h5 class="card-header">nRF9160 Guidelines</h5>
									<div class="card-body">
										<p class="card-text">
											This documents contain guidelines for hardware design,
											integration, and verification for nRF9160.
										</p>
										<a
											href="https://infocenter.nordicsemi.com/topic/struct_nrf91/struct/nrf91_guidelines.html"
											class="btn btn-primary"
										>
											Read the guide
										</a>
									</div>
									<div class="card-footer d-flex justify-content-between">
										{toTag('level:300')}
										<CellularTag />
										{toTag('product:nrf9160')}
									</div>
								</div>
								<div class="card">
									<h5 class="card-header">Online Power Profiler for LTE</h5>
									<div class="card-body">
										<p class="card-text">
											Use this tool to estimate the current consumption of the
											nRF91 LTE modem. The OPP supports both NB-IoT (cat NB1)
											and LTE-M (cat M1), and several other network parameters.
										</p>
										<a
											href="https://devzone.nordicsemi.com/power/w/opp/3/online-power-profiler-for-lte"
											class="btn btn-primary"
											target="_blank"
										>
											Use the tool
										</a>
									</div>
									<div class="card-footer d-flex justify-content-between">
										{toTag('level:200')}
										{toTag('ultra low-power')}
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
