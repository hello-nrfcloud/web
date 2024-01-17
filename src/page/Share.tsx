import { Secondary } from '#components/Buttons.js'
import { WaitingForDevice } from '#components/WaitingForDevice.js'
import { useDevice, type Device } from '#context/Device.js'
import { useMapShare } from '#context/MapShare.js'
import { useParameters } from '#context/Parameters.js'
import { validatingFetch } from '#utils/validatingFetch.js'
import { ShareDeviceOwnershipConfirmed } from '@hello.nrfcloud.com/proto/hello/map'
import { MapPinOffIcon } from 'lucide-preact'
import { useEffect, useState } from 'preact/hooks'
import './Device.css'
import type { Static } from '@sinclair/typebox'
import type { ProblemDetail } from '@hello.nrfcloud.com/proto/hello'

export const Share = () => {
	const { device } = useDevice()
	const { shared } = useMapShare()

	if (device === undefined)
		return (
			<div class="container">
				<div class="row">
					<div class="col my-4">
						<WaitingForDevice />
					</div>
				</div>
			</div>
		)

	return (
		<main>
			<article class="container">
				<section class="row my-4">
					<div class="col-12 col-lg-8 offset-lg-2 col-xl-6">
						<h1 class="py-4">Share device</h1>
						<table class="table mb-3">
							<tr>
								<th>Device ID:</th>
								<td>
									<code>{device.id}</code>
								</td>
							</tr>
							<tr>
								<th>Model:</th>
								<td>
									<code>{device.model.name}</code>
								</td>
							</tr>
							<tr>
								<th>Sharing status:</th>
								<td>
									{shared === undefined ? (
										<span>
											<MapPinOffIcon strokeWidth={1} /> not shared
										</span>
									) : (
										'public'
									)}
								</td>
							</tr>
						</table>
						<p>
							You can share this device on{' '}
							<a href="/map">hello.nrfcloud.com/map</a>.{' '}
						</p>
						<p>
							This means that data published by the device will be visible to
							everyone if it follows the{' '}
							<a
								href="https://github.com/hello-nrfcloud/proto-lwm2m"
								target="_blank"
								rel="noopener noreferrer"
							>
								LwM2M object definitions
							</a>{' '}
							for this project. You can of course register your own custom
							objects.
						</p>
						<p>
							Sharing cannot be done anonymously, and therefore you need to
							provide a valid email in order to activate sharing for this
							device.
						</p>
						<p>
							We will use your email only for contacting you about the devices
							you have shared.
						</p>
						<p>
							Every 30 days you need to confirm that you wish to continue
							sharing this device. Otherwise the device and all its public
							history will be deleted.
						</p>
						<p>You can also revoke the sharing of the device at any time.</p>
						<ShareDevice device={device} />
					</div>
				</section>
			</article>
		</main>
	)
}

const requestEmailConfirmation = validatingFetch(ShareDeviceOwnershipConfirmed)

const ShareDevice = ({ device }: { device: Device }) => {
	const [email, setEmail] = useState('')
	const [currentEmail, setCurrentEmail] = useState<string>()
	const isValid = isEmail(email)
	const { onParameters } = useParameters()
	const [problem, setProblem] = useState<Static<typeof ProblemDetail>>()

	useEffect(() => {
		if (!isEmail(currentEmail)) return
		onParameters(({ shareAPIURL }) => {
			requestEmailConfirmation(shareAPIURL, {
				id: device.id,
				email,
				model: device.model,
			})
				.start(() => {
					setProblem(undefined)
				})
				.problem(setProblem)
				.done(() => {
					setCurrentEmail(undefined)
				})
		})
	}, [currentEmail])

	return (
		<form>
			<p>
				<label htmlFor="email">Verify your email to get started:</label>{' '}
			</p>
			<div class="row row-cols-sm-auto g-2 align-items-center mb-3">
				<div class="col-12">
					<div class="input-group">
						<input
							type="email"
							minLength={1}
							class="form-control"
							id="email"
							placeholder='e.g. "alex@example.com"'
							value={email}
							onChange={(e) => {
								setEmail((e.target as HTMLInputElement).value)
							}}
						/>
					</div>
				</div>
				<div class="col-12">
					<Secondary
						disabled={!isValid || isEmail(currentEmail)}
						onClick={() => {
							setCurrentEmail(email)
						}}
					>
						verify email
					</Secondary>
				</div>
			</div>
			{isEmail(currentEmail) && (
				<div>
					<div
						class="progress"
						role="progressbar"
						aria-label="Animated striped example"
						aria-valuenow={50}
						aria-valuemin={0}
						aria-valuemax={100}
					>
						<div
							class="progress-bar progress-bar-striped progress-bar-animated"
							style="width: 50%"
						></div>
					</div>
					<p class="text-center mt-2">Sending verification email...</p>
				</div>
			)}
			{problem !== undefined && (
				<div class="alert alert-danger" role="alert">
					{problem.title}
				</div>
			)}
		</form>
	)
}

const isEmail = (s?: string) => /.+@.+/.test(s ?? '')
