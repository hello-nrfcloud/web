import { useDevice } from '@context/Device'
import { QrCode } from 'lucide-preact'
import { useState } from 'preact/hooks'
import { DKs } from '../DKs'
import { toTag } from './Tags'

export const DKSelector = () => {
	const [pin, setPIN] = useState<string>('01/by98b2')
	const isValid = /^[0-9]{2}\/[a-z0-9]{6}/.test(pin)
	const { fromPIN, fromType } = useDevice()

	return (
		<>
			<h2>Please scan the QR code on your DK</h2>
			<div class="d-flex mt-4">
				<img
					src="/static/images/qrcode.webp"
					class="img-fluid w-25"
					alt="Development Kit with QR code"
					width={730}
					height={631}
				/>
				<div class="ms-4">
					<p>
						The QR code on the Development Kit encodes a link with a code (e.g.{' '}
						<code>01/by98b2</code>) that contains the production run ID (e.g.
						<code>01</code>) and a unique code (e.g. <code>by98b2</code>) that
						will proof your ownership of the DK and will be used to look up the
						IMEI in our database.
					</p>
					<p>
						<button
							type="button"
							class="btn btn-primary"
							onClick={() => {
								fromPIN('01/by98b2')
							}}
						>
							<QrCode /> Scan QR code
						</button>
					</p>
					<h3 class="mt-4">No QR code?</h3>
					<p>Enter the PIN manually:</p>
					<form class="row row-cols-lg-auto g-3 align-items-center">
						<div class="col-12">
							<label class="visually-hidden" htmlFor="pinInput">
								PIN
							</label>
							<div class="input-group">
								<div class="input-group-text">PIN</div>
								<input
									type="text"
									minLength={9}
									maxLength={9}
									class="form-control form-control-sm"
									id="pinInput"
									placeholder="01/ba89hl"
									value={pin}
									onChange={(e) => {
										setPIN((e.target as HTMLInputElement).value)
									}}
								/>
							</div>
						</div>
						<div class="col-12">
							<button
								type="button"
								class="btn btn-primary"
								disabled={!isValid}
								onClick={() => {
									fromPIN('pin')
								}}
							>
								Submit
							</button>
						</div>
					</form>
				</div>
			</div>

			<h2 class="mt-4">... or select your hardware</h2>
			<div class="d-flex flex-col justify-content-between">
				{Object.entries(DKs).map(
					([id, { title, description, tags, learnMoreLink }]) => (
						<section
							class={'p-1'}
							style={{
								width: `${Math.floor(100 / Object.keys(DKs).length)}%`,
							}}
						>
							<button
								type={'button'}
								class="btn btn-link"
								onClick={() => {
									fromType(id)
								}}
							>
								<img
									alt={`${title} (${id})`}
									src={`/static/images/${id}.webp`}
									class="img-fluid"
								/>
								{title} <small>({id})</small>
							</button>
							<p>{description}</p>
							<p>
								<a href={learnMoreLink} target={'_blank'}>
									Learn more
								</a>
							</p>
							<aside class={'mb-2'}>
								{tags.map((tag) => (
									<span class={'me-2'}>{toTag(tag)}</span>
								))}
							</aside>
						</section>
					),
				)}
			</div>
		</>
	)
}
