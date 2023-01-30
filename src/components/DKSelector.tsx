import { useDevice } from '@context/Device'
import { QrCode } from 'lucide-preact'
import { useState } from 'preact/hooks'
import { DKs } from '../content/DKs'
import { toTag } from './Tags'

export const DKSelector = () => {
	const [productionRun, setProductionRun] = useState<string>('42')
	const [token, setToken] = useState<string>('d3c4fb4d')
	const code = `${productionRun}.${token}`
	const isValid = /^[0-9]{2}\.[ABCDEFGHIJKLMNPQRSTUVWXYZ1-9]{8}/i.test(code)
	const { fromCode, fromType } = useDevice()

	return (
		<>
			<h2>Please scan the QR code on your DK</h2>
			<div class="row mt-4">
				<div class="col-4">
					<img
						src="/static/images/qrcode.webp"
						class="img-fluid"
						alt="Development Kit with QR code"
						width={744}
						height={629}
					/>
				</div>
				<div class="col-4">
					<p>
						The QR code on the Development Kit encodes a link with a code (e.g.{' '}
						<code>42.d3c4fb4d</code>) that contains the production run ID (e.g.{' '}
						<code>42</code>) and a unique code (e.g. <code>d3c4fb4d</code>) that
						will prove your ownership of the DK and will be used to look up the
						IMEI in our database.
					</p>
					<p>
						<button
							type="button"
							class="btn btn-primary"
							onClick={() => {
								fromCode('42.d3c4fb4d')
							}}
						>
							<QrCode /> Scan QR code
						</button>
					</p>
				</div>
				<div class="col-4">
					<h3>No QR code?</h3>
					<p>Enter the code manually:</p>
					<form class="row row-cols-lg-auto g-3 align-items-center">
						<div class="col-12">
							<label class="visually-hidden" htmlFor="productionRunInput">
								Code
							</label>
							<div class="input-group">
								<div class="input-group-text">nrf.guide/</div>
								<input
									type="text"
									minLength={2}
									maxLength={2}
									class="form-control form-control-sm"
									id="productionRunInput"
									placeholder="42"
									value={productionRun}
									onChange={(e) => {
										setProductionRun((e.target as HTMLInputElement).value)
									}}
									size={2}
								/>
								<div class="input-group-text">.</div>
								<input
									type="text"
									minLength={8}
									maxLength={8}
									class="form-control form-control-sm"
									id="tokenInput"
									placeholder="d3c4fb4d"
									value={token}
									onChange={(e) => {
										setToken((e.target as HTMLInputElement).value)
									}}
									size={8}
								/>
							</div>
						</div>
						<div class="col-12">
							<button
								type="button"
								class="btn btn-primary"
								disabled={!isValid}
								onClick={() => {
									fromCode(code)
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
