import { Secondary } from '#components/Buttons.js'
import { ThingyWithQRCode } from '#components/ThingyWithQRCode.js'
import { useEffect, useState } from 'preact/hooks'
import { QRCodeGenerator } from '#components/QRCodeGenerator.js'
import { WithResize } from '#components/ResizeObserver.js'

export const ViewSource = () => (
	<main>
		<article>
			<div class="container mt-4">
				<header class="row">
					<div class="col-12 col-lg-8 offset-lg-2 col-xl-6 offset-xl-3">
						<h1>
							View source: how <code>hello.nrfcloud.com</code> is built.
						</h1>
					</div>
				</header>
				<div class="row mt-4">
					<div class="col-12 col-lg-8 offset-lg-2 col-xl-6 offset-xl-3">
						<section>
							<h2>About the project</h2>
							<p>
								We consider this a reference implementation for a consumer
								cellular IoT product, where the Nordic development kits are
								treated like a consumer cellular IoT device, for example a{' '}
								<em>Robot Lawnmower</em>, which is purchased by a consumer at a
								retail store, and when turned on should work{' '}
								<em>just like that</em>.
							</p>
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
								that forwards messages from these devices to our backend, which
								is in charge of transforming these messages into the format that
								is understood by the web application.
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
								so we can provide pre-compiled builds with the configuration
								that is optimal for the out-of-box experience. .
							</p>
							<h2>The frontend</h2>
							<p>
								The web site is a static web app, and the source code is
								published on{' '}
								<a href="https://github.com/hello-nrfcloud/web" target="_blank">
									GitHub
								</a>
								.
							</p>
						</section>
						<section>
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
					</div>
				</div>
				<div class="row my-4">
					<div class="col-12 col-lg-8 offset-lg-2 col-xl-6 offset-xl-3">
						<h2>QR codes</h2>
						<p>
							The easiest way to access the page for an individual device is to
							scan a QR code, which encodes a <em>fingerprint</em> (more about
							that later) and the URL of this page.
						</p>
						<p>Here is an example:</p>
						<div class="mb-4">
							<QRCodeGenerator />
						</div>
						<WithResize>
							{(size) => <ThingyWithQRCode size={size} />}
						</WithResize>
						<h3>Manually entering the fingerprint</h3>
						<p>
							If users cannot scan the QR code because they do not have a
							camera, they have to enter the fingerprint manually.
						</p>
						<p>
							The fingerprint is designed so that there are no ambiguous
							letters, e.g. <code>o</code> (lowercase &quot;o&quot;) and{' '}
							<code>0</code> (Zero), which enables the user to enter it manually
							without making too many mistakes.
						</p>
						<h4>Try it yourself</h4>
						<CodeInputChallenge
							newCode={() => [
								parseInt(
									`23${1 + Math.floor(Math.random() * 53)}`,
									10,
								).toString(16),
								generateCode(),
							]}
						/>
						<h4>Alternatives</h4>
						<p>Now compare this to entering an IMEI and a PIN:</p>
						<CodeInputChallenge
							newCode={() => [generateIMEI(), generatePIN()]}
						/>
						<p>Or a device UUID</p>
						<CodeInputChallenge newCode={() => [generateUUID()]} />
					</div>
				</div>
			</div>
		</article>
	</main>
)

const CodeInputChallenge = ({ newCode }: { newCode: () => string[] }) => {
	const [code, setCode] = useState<string[]>(newCode())
	const [enteredCode, setEnteredCode] = useState<string[]>([])
	const [startTime, setStartTime] = useState<Date>()
	const [endTime, setEndTime] = useState<Date>()

	useEffect(() => {
		const e = enteredCode.join(' ')
		if (e.length > 0 && startTime === undefined) {
			setStartTime(new Date())
		}
		if (e === code.join(' ')) {
			setEndTime(new Date())
		}
	}, [enteredCode])

	const isValid = code.join(' ') === enteredCode.join(' ')

	return (
		<form class="mt-0 mb-3">
			<p>
				Type the following:{' '}
				{code.map((s, k) => (
					<>
						<code>{s}</code>
						{code.length > 1 && k < code.length - 1 && <span>{' and '}</span>}
					</>
				))}
			</p>
			<div class="row">
				{code.map((part, k) => (
					<div class="input-group col">
						<input
							type="text"
							minLength={part.length}
							maxLength={part.length}
							class={'form-control form-control-sm'}
							placeholder={part}
							value={enteredCode[k] ?? ''}
							onChange={(e) => {
								setEnteredCode((entered) => {
									entered[k] = (e.target as HTMLInputElement).value
									return [...entered]
								})
							}}
							size={part.length}
							required
							style={{ fontFamily: 'monospace' }}
						/>
					</div>
				))}
			</div>

			{isValid && startTime !== undefined && endTime !== undefined && (
				<p class="mt-2 d-flex justify-content-between">
					<span>
						Great, that took you{' '}
						{Math.round((endTime.getTime() - startTime.getTime()) / 1000)}s.
					</span>
					<Secondary
						outline
						small
						onClick={() => {
							setStartTime(undefined)
							setEndTime(undefined)
							setCode(newCode())
							setEnteredCode([])
						}}
					>
						reset
					</Secondary>
				</p>
			)}
		</form>
	)
}

export const generateCode = (len = 6) => {
	const alphabet = 'abcdefghijkmnpqrstuvwxyz' // Removed o
	const numbers = '23456789' // Removed 0
	const characters = `${alphabet}${numbers}`

	let code = ``
	for (let n = 0; n < len; n++) {
		code = `${code}${characters[Math.floor(Math.random() * characters.length)]}`
	}
	return code
}

export const generateIMEI = () =>
	`3566642${Math.floor(Math.random() * 100000000)}`

const generatePIN = () => {
	const pin = []
	while (pin.length < 6) {
		pin.push(Math.floor(Math.random() * 10).toString())
	}
	return pin.join('')
}

const generateUUID = () => {
	const hex = [...Array(256).keys()].map((index) =>
		index.toString(16).padStart(2, '0'),
	)

	const r = crypto.getRandomValues(new Uint8Array(16))

	r[6] = (r[6] ?? 0 & 0x0f) | 0x40
	r[8] = (r[8] ?? 0 & 0x3f) | 0x80

	return [...r.entries()]
		.map(([index, int]) =>
			[4, 6, 8, 10].includes(index) ? `-${hex[int]}` : hex[int],
		)
		.join('')
}
