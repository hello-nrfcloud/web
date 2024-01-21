import { ThingyWithQRCode } from '#components/ThingyWithQRCode.js'
import { QRCodeGenerator } from '#components/QRCodeGenerator.js'
import { WithResize } from '#components/ResizeObserver.js'

export const ViewSource = () => (
	<main class="view-source">
		<article>
			<header style={{ backgroundColor: 'var(--color-nordic-blue)' }}>
				<div class="container py-4">
					<div class="row">
						<div class="col-12 col-lg-8 offset-lg-2 col-xl-6">
							<h1>
								<small class={'fs-6'}>View source</small>
								<br />
								How hello.nrfcloud.com is built.
							</h1>
						</div>
					</div>
				</div>
			</header>
			<div class="bg-blue">
				<div class="container py-4">
					<section class="row mt-4">
						<div class="col-12 col-lg-8 offset-lg-2 col-xl-6">
							<h2>About the project</h2>
							<p>
								We consider this a reference implementation for a consumer
								cellular IoT product, where Nordic development kits are treated
								like a consumer cellular IoT device, for example a{' '}
								<em>Robot Lawnmower</em>, which is purchased by a consumer at a
								retail store, and when turned on should work{' '}
								<em>just like that</em>.
							</p>
						</div>
					</section>
				</div>
			</div>
			<div class="container my-4">
				<section class="row mt-4">
					<div class="col-12 col-lg-8 offset-lg-2 col-xl-6">
						<h2>The backend</h2>
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
							We have set up a{' '}
							<a
								href="https://docs.nrfcloud.com/Devices/MessagesAndAlerts/SetupMessageBridge/"
								target="_blank"
							>
								Message Bridge
							</a>{' '}
							that forwards messages from these devices to our backend, which is
							in charge of transforming these messages into the format that is
							understood by the web application.
						</p>
						<p>
							This includes regularly fetching the shadow of the devices using
							the{' '}
							<a
								href="https://api.nrfcloud.com/v1#tag/All-Devices/operation/FetchDevice"
								target="_blank"
							>
								nRF Cloud REST API
							</a>
							.
						</p>
						<p>
							It also maintains the database of devices that can be access on
							this website using their <em>fingerprint</em>.
						</p>
						<p>
							Check out{' '}
							<a
								href="https://github.com/hello-nrfcloud/backend"
								target="_blank"
							>
								the source code of the project on GitHub
							</a>
							, and especially the{' '}
							<a
								href="https://github.com/hello-nrfcloud/backend/tree/saga/features"
								target="_blank"
							>
								feature files
							</a>{' '}
							that document the functionality that has been implemented.
						</p>
					</div>
				</section>
				<section class="row mt-4">
					<div class="col-12 col-lg-8 offset-lg-2 col-xl-6">
						<h2>The firmware</h2>
						<p>
							Devices connect directly to the{' '}
							<a
								href="https://docs.nrfcloud.com/APIs/MQTT/MQTTIntro/"
								target="_blank"
							>
								nRF Cloud MQTT endpoint
							</a>{' '}
							and are running the{' '}
							<a
								href="https://developer.nordicsemi.com/nRF_Connect_SDK/doc/latest/nrf/applications/asset_tracker_v2/README.html"
								target="_blank"
							>
								<code>asset_tracker_v2</code> application
							</a>
							. Firmware builds are published in an{' '}
							<a
								href="https://github.com/hello-nrfcloud/firmware"
								target="_blank"
							>
								out-of-tree repository on GitHub
							</a>{' '}
							so we can provide pre-compiled builds with the configuration that
							is optimal for the out-of-box experience. .
						</p>
						<h3>Cloud connection</h3>
						<p>
							Devices need to connect nRF Cloud using a certificate that is
							pre-provisioned (in case of our development kits) or has been
							created using the{' '}
							<em>
								<a
									href="https://github.com/hello-nrfcloud/backend/issues/479"
									target="_blank"
								>
									custom device onboarding
								</a>
							</em>{' '}
							(this feature not yet available) of{' '}
							<code>hello.nrfcloud.com</code>.
						</p>
						<h4>Why the attestation token cannot be used</h4>
						<p>
							nRF 9x devices with modem firmware &gt;=2.0.0{' '}
							<a
								href="https://docs.nordicsemi.com/bundle/nrf-cloud/page/Devices/Security/Credentials.html"
								target="_blank"
							>
								ship with an attestation token
							</a>{' '}
							which can be used directly to{' '}
							<a
								href="https://docs.nordicsemi.com/bundle/nrf-cloud/page/APIs/CoAP/CoAPOverview.html"
								target="_blank"
							>
								authenticate against nRF Cloud's CoAP API
							</a>
							, but{' '}
							<a
								href="https://docs.nordicsemi.com/bundle/nrf-cloud/page/APIs/CoAP/CoAPOverview.html#authentication"
								target="_blank"
							>
								only after it has been on-boarded
							</a>
							.
						</p>
						<p>
							This means that a device would need to be associated with the{' '}
							<code>hello.nrfcloud.com</code> nRF Cloud Account for the
							out-of-box experience to work.
						</p>
						<p>
							But if users want to use their device with <em>their own</em> nRF
							Cloud it would have to be disassociated from the{' '}
							<code>hello.nrfcloud.com</code> nRF Cloud account first.
						</p>
						<p>
							This would also not allow a fallback in case the users hands over
							this device to a colleague. They would then need to disassociate
							the device from their account first.
						</p>
						<p>
							Provisioning the device with a second certificate solves this:
						</p>
						<ul>
							<li>
								If a user wants to use the device with their own nRF Cloud
								account they can flash any firmware as long as it is not using
								the <code>hello.nrfcloud.com</code> secTag <code>42</code>.
							</li>
							<li>
								If they want the original out-of-box behaviour, they only have
								to flash the out-of-box firmware back.
							</li>
						</ul>
					</div>
				</section>
				<section class="row mt-4">
					<div class="col-12 col-lg-8 offset-lg-2 col-xl-6">
						<h2>The frontend</h2>
						<p>
							The web site is a static web app, and the source code is published
							on{' '}
							<a href="https://github.com/hello-nrfcloud/web" target="_blank">
								GitHub
							</a>
							.
						</p>
						<p>
							It is build using{' '}
							<a href="https://vike.dev/" target="_blank">
								Vike
							</a>{' '}
							which allows to build both a dynamic web app with{' '}
							<a href="https://preactjs.com/" target="_blank">
								Preact
							</a>{' '}
							and{' '}
							<a href="https://www.typescriptlang.org/" target="_blank">
								TypeScript
							</a>{' '}
							as well as render static pages (for example for the development
							kit pages){' '}
							<a
								href="https://github.com/hello-nrfcloud/web/blob/saga/content/models/PCA20035%2Bsolar.md"
								target="_blank"
							>
								using Markdown files
							</a>
							.
						</p>
						<p>
							The base UI framework is{' '}
							<a href="https://getbootstrap.com/" target="_blank">
								Bootstrap 5
							</a>{' '}
							which has been modified to match{' '}
							<a href="https://blueprint.nordicsemi.com/" target="_blank">
								Nordic Semiconductor's style guide
							</a>
							.
						</p>
						<p>
							The{' '}
							<a href="https://lucide.dev/icons/" target="_blank">
								Lucide
							</a>{' '}
							icons are used to annotate interactive elements.
						</p>
					</div>
				</section>
				<section class="row mt-4">
					<div class="col-12 col-lg-8 offset-lg-2 col-xl-6">
						<h2>The map</h2>
						<p>
							Device owners (those who know the fingerprint of a device) can
							opt-in to make the device data publicly available on{' '}
							<a href="https://hello.nrfcloud.com/map" target="_blank">
								hello.nrfcloud.com/map
							</a>
							.
						</p>
						<p>
							Data published by the device to nRF Cloud will be visible to
							everyone if it follows the{' '}
							<a
								href="https://github.com/hello-nrfcloud/proto-lwm2m"
								target="_blank"
								rel="noopener noreferrer"
							>
								LwM2M object definitions
							</a>{' '}
							for this project. This allows anyone to describe the data their
							device is sending and for the map application interpret arbitrary
							device information. Certain objects (for example location,
							environment) will have additional UI features, which can be
							re-used for all devices that fulfill the object definition.
						</p>
						<p>
							This only works if the device connects to nRF Cloud using the{' '}
							<code>hello.nrfcloud.com</code> credentials.
						</p>
					</div>
				</section>
			</div>
			<div class="bg-light">
				<div class="container py-4">
					<div class="row mt-4">
						<section class="col-12 col-lg-8 offset-lg-2 col-xl-6">
							<h2>nRF Cloud Location services</h2>
							<p>
								This project integrates directly with the{' '}
								<a
									href="https://www.nordicsemi.com/Products/Cloud-services#infotabs"
									target="_blank"
								>
									nRF Cloud Location services
								</a>{' '}
								for showing device location on the map.
							</p>
							<h3>Ground fix API</h3>
							<p>
								The coarse location of a device is acquired by using the Ground
								fix API, which turns neighboring cell scans of the device (which
								contain LTE and Wi-Fi cell information), into an approximate
								location.
							</p>
							<p>
								The device sends these cell scans using the{' '}
								<a
									href="https://github.com/hello-nrfcloud/nrfcloud-application-protocols/blob/30a546edce7182463c5dcdb05ad7a8afdf6eee6a/schemas/deviceToCloud/ground_fix/ground-fix-example.json"
									target="_blank"
								>
									GROUND_FIX
								</a>{' '}
								message via MQTT.
							</p>
							<p>
								nRF Cloud resolves these scans to a geo location and sends the
								location{' '}
								<a
									href="https://github.com/hello-nrfcloud/nrfcloud-application-protocols/blob/30a546edce7182463c5dcdb05ad7a8afdf6eee6a/schemas/cloudToDevice/ground_fix/ground-fix-example.json"
									target="_blank"
								>
									via MQTT to the device
								</a>
								.
							</p>
							<p>
								These messages{' '}
								<a
									href="https://github.com/hello-nrfcloud/backend/blob/7406e3bf7b52a3cdd232c0b0c759796ea7f0d337/features/DeviceToWebsocket.feature.md"
									target="_blank"
								>
									are received
								</a>{' '}
								by the hello.nrfcloud.com backend using the{' '}
								<a href="https://docs.nrfcloud.com/Devices/MessagesAndAlerts/SetupMessageBridge.html">
									a message bridge
								</a>
								.
							</p>
						</section>
						<aside class="col-12 col-lg-8 offset-lg-2 col-xl-4 offset-xl-0 mt-4 mt-xl-0">
							<h2>
								What are <em>Location Services</em>?
							</h2>
							<p>
								Location services are the cornerstone to for devices being able
								to position themselves accurately, quickly and efficiently. By
								utilizing our single-cell (SCELL), multi-cell (MCELL), assisted
								GPS (A-GPS), predicted GPS (P-GPS) and/or Wi-Fi location
								features, customer's devices are guaranteed to last longer in
								the field, while sending accurate location data to the cloud.
							</p>
							<p>
								<a
									href="https://www.nordicsemi.com/Products/Cloud-services#infotabs"
									target="_blank"
								>
									nRF Cloud Location services
								</a>{' '}
								can be used to assist devices and customer applications that
								need fast and power-efficient location details. They are
								designed specifically for Nordic silicon to enable high
								performing and ultra-low power consuming product solution. It
								includes A-GPS, P-GPS, SCELL, MCELL and Wi-Fi location features.
							</p>
						</aside>
					</div>
				</div>
			</div>
			<div class="container py-4">
				<section>
					<div class="row mt-4">
						<div class="col-12 col-lg-8 offset-lg-2 col-xl-6">
							<h2>QR codes</h2>
							<p>
								The easiest way to access the page for an individual device is
								to scan a QR code, which encodes a <em>fingerprint</em> (more
								about that later) and the URL of this page.
							</p>
							<WithResize>
								{(size) => <ThingyWithQRCode size={size} />}
							</WithResize>
						</div>
						<div class="col-12 col-lg-8 offset-lg-2 col-xl-4 offset-xl-0 mt-4 mt-xl-0">
							<p>Here is an example:</p>
							<div class="mb-4">
								<QRCodeGenerator />
							</div>
						</div>
					</div>
					<div class="row mt-4">
						<div class="col-12 col-lg-8 offset-lg-2 col-xl-6">
							<h3 class="mt-4">Manually entering the fingerprint</h3>
							<p>
								If users cannot scan the QR code because they do not have a
								camera, they have to enter the fingerprint manually.
							</p>
							<p>
								The fingerprint is designed so that there are no ambiguous
								letters, e.g. <code>o</code> (lowercase &quot;o&quot;) and{' '}
								<code>0</code> (Zero), which enables the user to enter it
								manually without making too many mistakes.
							</p>
						</div>
					</div>
				</section>
			</div>
		</article>
	</main>
)
