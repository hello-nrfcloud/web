import { Secondary } from '#components/Buttons.js'
import { SourceHeader } from '#components/SourceHeader.js'
import { StyleGuide } from '#components/StyleGuide.js'
import { useEffect, useState } from 'preact/hooks'
import { QRCodeGenerator } from '../components/QRCodeGenerator.js'

export const ViewSource = () => (
	<main>
		<article>
			<SourceHeader />
			<div class="container mt-4">
				<div class="row mt-4">
					<div class="col-12 col-md-6">
						<section>
							<h2>This sections explains how this project is built.</h2>
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
								<a
									href="https://github.com/bifravst/Muninn-frontend"
									target="_blank"
								>
									GitHub
								</a>
								.
							</p>
						</section>
						<StyleGuide />
					</div>
					<div class="col-12 col-md-6">
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
								Math.floor(Math.random() * 100).toString(16),
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

const generateCode = (len = 6) => {
	const alphabet = 'abcdefghijkmnpqrstuvwxyz' // Removed o
	const numbers = '23456789' // Removed 0
	const characters = `${alphabet}${numbers}`

	let code = ``
	for (let n = 0; n < len; n++) {
		code = `${code}${characters[Math.floor(Math.random() * characters.length)]}`
	}
	return code
}

const generateIMEI = () => `3566642${Math.floor(Math.random() * 100000000)}`

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
