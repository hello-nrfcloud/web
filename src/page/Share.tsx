import { Secondary } from '#components/Buttons.js'
import { WaitingForDevice } from '#components/WaitingForDevice.js'
import { useDevice, type Device } from '#context/Device.js'
import { useMapShare } from '#context/MapShare.js'
import { useParameters } from '#context/Parameters.js'
import { validatingFetch, type FetchProblem } from '#utils/validatingFetch.js'
import {
	Devices,
	ShareDeviceOwnershipConfirmed,
	ShareDeviceRequest,
} from '@hello.nrfcloud.com/proto/hello/map'
import { MapPinOffIcon, RefreshCwIcon } from 'lucide-preact'
import { useEffect, useState } from 'preact/hooks'
import './Device.css'
import { useFingerprint } from '#context/Fingerprint.js'
import { publicDeviceURL } from '#map/publicDeviceLink.js'
import { type Static, Type } from '@sinclair/typebox'
import {
	PublicDevice,
	LwM2MObjectInstance,
} from '@hello.nrfcloud.com/proto/hello/map'
import { timestampResources } from '@hello.nrfcloud.com/proto-lwm2m'
import { formatDistanceToNow } from 'date-fns'

const fetchState = validatingFetch(Devices)

export const Share = () => {
	const { fingerprint } = useFingerprint()
	const { device } = useDevice()
	const { shared, refresh } = useMapShare()
	const { onParameters } = useParameters()
	const [state, setState] = useState<Static<typeof PublicDevice>['state']>()

	const fetchDeviceState = ({ id }: { id: string }) =>
		onParameters(({ devicesAPIURL }) => {
			fetchState(new URL(`${devicesAPIURL}?ids=${id}`)).ok(({ devices }) => {
				setState(devices[0]?.state)
			})
		})

	useEffect(() => {
		if (shared === undefined) return
		fetchDeviceState(shared)
	}, [shared])

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
					<div class="col-12 col-lg-6 offset-lg-1 offset-xl-0 col-xl-6">
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
										Your device has been shared. You can access it using this
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
						<hr />
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
							for this project. You can of course register your own custom
							objects.
						</p>
						<p>
							This also only works if the device connects to nRF Cloud using the{' '}
							<code>hello.nrfcloud.com</code> credentials.
						</p>
					</div>
					<div class="col-12 col-lg-4 col-xl-6">
						{shared !== undefined && state !== undefined && (
							<>
								<h2 class="d-flex justify-content-between align-items-center">
									<span>Current state</span>
									<button
										type="button"
										class="btn btn-secondary"
										onClick={() => fetchDeviceState(shared)}
									>
										<RefreshCwIcon strokeWidth={1} />
									</button>
								</h2>
								<LwM2MStateViewer state={state} />
							</>
						)}
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

const State = Type.Array(LwM2MObjectInstance)
const LwM2MStateViewer = ({ state }: { state: Static<typeof State> }) => {
	return (
		<aside>
			{state.map((instance) => (
				<LwM2MObjectInstanceView instance={instance} />
			))}
		</aside>
	)
}
const LwM2MObjectInstanceView = ({
	instance,
}: {
	instance: Static<typeof LwM2MObjectInstance>
}) => {
	return (
		<div>
			<table class="table">
				<tr>
					<th>ID @ Version</th>
					<td>
						<a
							href={`https://github.com/hello-nrfcloud/proto-lwm2m/blob/saga/lwm2m/${instance.ObjectID}.xml`}
							target={'_blank'}
						>
							{instance.ObjectID}
						</a>
						@ {instance.ObjectVersion ?? '1.0'}
					</td>
				</tr>
				<tr>
					<th>Timestamp</th>
					<td>
						<InstanceTimestamp instance={instance} />
					</td>
				</tr>
				<tr>
					<th>Instance</th>
					<td>
						<span>{instance.ObjectInstanceID ?? 0}</span>
					</td>
				</tr>
				<Resources instance={instance} />
			</table>
			<hr />
		</div>
	)
}

const InstanceTimestamp = ({
	instance,
}: {
	instance: Static<typeof LwM2MObjectInstance>
}) => {
	const tsResource = timestampResources[instance.ObjectID]
	if (tsResource === undefined)
		return <span>Unknown ObjectID {instance.ObjectID}</span>
	const v = instance.Resources[tsResource]
	if (typeof v !== 'string') return <span>Timestamp could not be parsed.</span>
	const ts = new Date(v)
	return (
		<time dateTime={ts.toISOString()}>
			{formatDistanceToNow(ts, { addSuffix: true })}
		</time>
	)
}

const Resources = ({
	instance,
}: {
	instance: Static<typeof LwM2MObjectInstance>
}) => {
	const tsResource = timestampResources[instance.ObjectID]

	return (
		<>
			<tr>
				<th colSpan={2}>Resources</th>
			</tr>
			{Object.entries(instance.Resources)
				.filter(([ResourceID]) => parseInt(ResourceID, 10) !== tsResource)
				.map(([ResourceID, value]) => (
					<tr>
						<th>
							<code>{ResourceID}</code>
						</th>
						<td>
							<code>{value}</code>
						</td>
					</tr>
				))}
		</>
	)
}
