import { isCode } from '@utils/isCode'
import { useEffect, useState } from 'preact/hooks'
import QRCode from 'qrcode'

export const QRCodeGenerator = () => {
	const [productionRun, setProductionRun] = useState<string>('42')
	const [token, setToken] = useState<string>('d3c4fb4d')
	const code = `${productionRun}.${token}`
	const isValid = isCode(code)

	return (
		<section>
			<form class="row">
				<div class="col-4">
					{isValid && (
						<QrCode url={new URL(`https://${DOMAIN_NAME}/${code}`)} />
					)}
				</div>
				<div class="col-8">
					<label class="visually-hidden" htmlFor="productionRunInput">
						Code
					</label>
					<div class="input-group">
						<div class="input-group-text">{DOMAIN_NAME}/</div>
						<input
							type="text"
							minLength={1}
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
					<div id="passwordHelpBlock" class="form-text">
						The QR code encodes a link with a code (e.g.{' '}
						<code>42.d3c4fb4d</code>) that contains the production run ID (e.g.{' '}
						<code>42</code>) and a unique code (e.g. <code>d3c4fb4d</code>) that
						will prove a user's ownership of the kit and will be used to look up
						the device information in our database.
					</div>
				</div>
			</form>
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
		<div>
			<img
				src={imageData}
				alt={`QR Code for ${url.toString()}`}
				class="w-100"
			/>
			<small>{url.toString().replace(/https?:\/\//, '')}</small>
		</div>
	)
}
