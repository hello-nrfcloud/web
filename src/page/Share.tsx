import { Secondary } from '#components/Buttons.js'
import { WaitingForDevice } from '#components/WaitingForDevice.js'
import { useDevice, type Device } from '#context/Device.js'
import { useFingerprint } from '#context/Fingerprint.js'
import { useMapShare } from '#context/MapShare.js'
import { useParameters } from '#context/Parameters.js'
import { publicDeviceURL } from '#map/publicDeviceLink.js'
import { validatingFetch, type FetchProblem } from '#utils/validatingFetch.js'
import {
	ShareDeviceOwnershipConfirmed,
	ShareDeviceRequest,
} from '@hello.nrfcloud.com/proto/hello/map'
import { MapPinOffIcon } from 'lucide-preact'
import { useEffect, useState } from 'preact/hooks'
import './Device.css'

export const Share = () => {
	const { fingerprint } = useFingerprint()
	const { device } = useDevice()
	const { shared, refresh } = useMapShare()

	if (fingerprint === null)
		return (
			<div class="container">
				<div class="row">
					<div class="col my-4">
						<p>
							No fingerprint provided. Please <a href="/">start over</a>.
						</p>
					</div>
				</div>
			</div>
		)

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
					<div class="col-12 col-lg-6 offset-lg-3">
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
							{shared === undefined && (
								<tr>
									<th>Sharing status:</th>
									<td>
										<span>
											<MapPinOffIcon strokeWidth={1} /> not shared
										</span>
									</td>
								</tr>
							)}
							{shared !== undefined && (
								<tr>
									<th>Public device ID:</th>
									<td>
										<code>{shared.id}</code>
									</td>
								</tr>
							)}
						</table>

						{shared !== undefined && (
							<>
								<div class="alert alert-success" role="alert">
									<p>
										Your device has been shared. It can be accessed using this
										link:{' '}
										<a
											href={publicDeviceURL(shared).toString()}
											target={'_blank'}
										>
											{publicDeviceURL(shared).toString()}
										</a>
									</p>
								</div>
							</>
						)}

						{shared === undefined && (
							<>
								<p>
									You can share this device on{' '}
									<a href="/map">hello.nrfcloud.com/map</a>.{' '}
								</p>
								<p>
									Sharing cannot be done anonymously, and therefore you need to
									provide a valid email in order to activate sharing for this
									device.
								</p>
								<p>
									We will use your email only for contacting you about the
									devices you have shared.
								</p>
								<ShareDevice
									device={device}
									onShared={() => {
										refresh()
									}}
								/>
							</>
						)}

						<p>
							Every 30 days you need to confirm that you wish to continue
							sharing this device. Otherwise the device and all its public
							history will be deleted.
						</p>
						<p>You can revoke the sharing of the device at any time.</p>
					</div>
				</section>
			</article>
		</main>
	)
}

const requestEmailConfirmation = validatingFetch(ShareDeviceRequest)
const confirmOwnership = validatingFetch(ShareDeviceOwnershipConfirmed)

const ShareDevice = ({
	device,
	onShared,
}: {
	device: Device
	onShared: (id: string) => void
}) => {
	const [email, setEmail] = useState('')
	const [token, setToken] = useState('')
	const [currentEmail, setCurrentEmail] = useState<string>()
	const [currentToken, setCurrentToken] = useState<string>()
	const { onParameters } = useParameters()
	const [problem, setProblem] = useState<FetchProblem>()

	const isValidEmail = isEmail(email)
	const isValidToken = isToken(token)

	useEffect(() => {
		if (!isEmail(currentEmail)) return
		onParameters(({ shareAPIURL }) => {
			requestEmailConfirmation(shareAPIURL, {
				deviceId: device.id,
				email,
				model: device.model.name,
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

	useEffect(() => {
		if (!isToken(currentToken)) return
		onParameters(({ confirmOwnershipAPIURL }) => {
			confirmOwnership(confirmOwnershipAPIURL, {
				deviceId: device.id,
				token,
			})
				.start(() => {
					setProblem(undefined)
				})
				.ok(({ id }) => {
					onShared(id)
				})
				.problem(setProblem)
				.done(() => {
					setCurrentToken(undefined)
				})
		})
	}, [currentToken])

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
						disabled={!isValidEmail || isEmail(currentEmail)}
						onClick={() => {
							setCurrentEmail(email)
						}}
					>
						verify email
					</Secondary>
				</div>
			</div>
			<p>
				<label htmlFor="token">
					Enter the token that you have received via email:
				</label>{' '}
			</p>
			<div class="row row-cols-sm-auto g-2 align-items-center mb-3">
				<div class="col-12">
					<div class="input-group">
						<input
							type="text"
							minLength={6}
							maxLength={6}
							class="form-control"
							id="token"
							placeholder='e.g. "gabq6h"'
							value={token}
							onChange={(e) => {
								setToken((e.target as HTMLInputElement).value)
							}}
						/>
					</div>
				</div>
				<div class="col-12">
					<Secondary
						disabled={!isValidToken || isEmail(currentEmail)}
						onClick={() => {
							setCurrentToken(token)
						}}
					>
						confirm ownership
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
					<p>
						<strong>{problem.problem.title}</strong>
					</p>
					{problem.awsReqId !== undefined ? (
						<p>
							<small>
								AWS Request ID: <code>{problem.awsReqId}</code>
							</small>
						</p>
					) : null}
				</div>
			)}
		</form>
	)
}

const isEmail = (s?: string) => /.+@.+/.test(s ?? '')
const isToken = (s?: string) =>
	/^[ABCDEFGHIJKMNPQRSTUVWXYZ23456789]{6}$/.test(s ?? '')
