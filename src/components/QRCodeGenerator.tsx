import { isFingerprint } from '#utils/isFingerprint.js'
import { useEffect, useState } from 'preact/hooks'
import QRCode from 'qrcode'

export const QRCodeGenerator = () => {
	const [productionRun, setProductionRun] = useState<string>('42')
	const [token, setToken] = useState<string>('d3c4fb')
	const fingerprint = `${parseInt(productionRun, 10).toString(16)}.${token}`
	const isValid = isFingerprint(fingerprint)

	const url = isValid
		? new URL(`https://${DOMAIN_NAME}/${fingerprint}`)
		: undefined

	return (
		<section>
			<form class="row">
				<div class="col-4">{url !== undefined && <QrCode url={url} />}</div>
				<div class="col-8">
					<div class="mb-2">
						<label>
							Production run number:
							<input
								type="number"
								min={1}
								class="form-control form-control"
								id="productionRunInput"
								placeholder="42"
								value={productionRun}
								onChange={(e) => {
									setProductionRun((e.target as HTMLInputElement).value)
								}}
							/>
						</label>
					</div>
					<div class="mb-2">
						<label>
							Unique token:
							<input
								type="text"
								minLength={6}
								maxLength={6}
								class="form-control"
								id="tokenInput"
								placeholder="d3c4fb4d"
								value={token}
								onChange={(e) => {
									setToken((e.target as HTMLInputElement).value)
								}}
							/>
						</label>
					</div>
				</div>
			</form>
			{url !== undefined && (
				<p>
					<a href={url.toString()} target="_blank">
						<code>{url.toString()}</code>
					</a>
				</p>
			)}
			<p class="mt-3">
				The QR code encodes a link with a fingerprint (e.g.{' '}
				<code>2f.d3c4fb</code>) that contains the production run number (e.g.{' '}
				<code>42</code>) and a unique token (e.g. <code>d3c4fb</code>) that will
				prove a user's ownership of the kit and will be used to look up the
				device information in our database.
			</p>
		</section>
	)
}

const QrCode = ({ url }: { url: URL }) => {
	const [imageData, setImageData] = useState<string>()
	useEffect(() => {
		QRCode.toDataURL(url.toString(), {
			type: 'image/png',
			errorCorrectionLevel: 'L',
			version: 3,
			margin: 0,
			scale: 10,
		})
			.then((dataUrl) => {
				setImageData(dataUrl)
			})
			.catch((err) => console.error(`[QRCode]`, err))
	}, [url])

	if (imageData === undefined) return null
	return (
		<img src={imageData} alt={`QR Code for ${url.toString()}`} class="w-100" />
	)
}
